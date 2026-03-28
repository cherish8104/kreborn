// 토스페이먼츠 결제 승인 (POST /v1/payments/confirm)
// Supabase 시크릿 설정 필요:
//   TOSS_SECRET_KEY            : 토스페이먼츠 시크릿 키
//   SUPABASE_URL               : 자동 주입
//   SUPABASE_SERVICE_ROLE_KEY  : 자동 주입

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { paymentKey, orderId, amount, shareCode, checkOnly } = await req.json();

    if (!shareCode) {
      return json({ error: 'shareCode required' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // ── DB 상태만 확인하는 모드 (폴링용) ──────────────────────────
    if (checkOnly) {
      const { data: dbUser } = await supabase
        .from('users')
        .select('is_paid')
        .eq('share_code', shareCode)
        .single();

      return json({ paid: dbUser?.is_paid === true });
    }

    // ── 결제 승인 요청 ──────────────────────────────────────────
    if (!paymentKey || !orderId || !amount) {
      return json({ error: 'paymentKey, orderId, amount required' }, 400);
    }

    const secretKey = Deno.env.get('TOSS_SECRET_KEY');
    if (!secretKey) {
      console.error('[toss-confirm] TOSS_SECRET_KEY not configured');
      return json({ error: 'Payment configuration missing' }, 500);
    }

    // Basic 인증: 시크릿키 + ':' → Base64
    const authHeader = 'Basic ' + btoa(secretKey + ':');

    const confirmRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const confirmData = await confirmRes.json();

    if (!confirmRes.ok) {
      console.error('[toss-confirm] API error', confirmRes.status, JSON.stringify(confirmData));
      return json({
        error: confirmData.message ?? `TossPayments error: ${confirmRes.status}`,
        code: confirmData.code,
      }, 502);
    }

    // 승인 성공 (status === 'DONE')
    if (confirmData.status === 'DONE') {
      const { error } = await supabase
        .from('users')
        .update({ is_paid: true, toss_payment_key: paymentKey })
        .eq('share_code', shareCode);

      if (error) {
        console.error('[toss-confirm] DB update error', error);
        return json({ error: error.message }, 500);
      }

      console.log('[toss-confirm] Payment confirmed for share_code:', shareCode, 'paymentKey:', paymentKey);
      return json({ paid: true, paymentKey });
    }

    console.log('[toss-confirm] Unexpected status:', confirmData.status);
    return json({ paid: false, status: confirmData.status });
  } catch (err) {
    console.error('[toss-confirm]', err);
    return json({ error: String(err) }, 500);
  }
});
