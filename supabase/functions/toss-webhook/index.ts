// 토스페이먼츠 결제 상태 웹훅 핸들러
// Supabase 시크릿 설정 필요:
//   TOSS_SECRET_KEY            : 토스페이먼츠 시크릿 키 (웹훅 검증용)
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
    const body = await req.text();
    const payload = JSON.parse(body);

    // 토스페이먼츠 웹훅: paymentKey로 결제 상태 확인
    const { paymentKey, status, orderId } = payload;

    console.log('[toss-webhook] received:', { paymentKey, status, orderId });

    // DONE 상태만 처리
    if (status !== 'DONE' || !paymentKey) {
      return json({ ok: true, skipped: true });
    }

    // orderId에서 shareCode 추출: KREBORN-{shareCode}-{timestamp}
    const match = orderId?.match(/^KREBORN-(.+)-\d+$/);
    const shareCode = match?.[1];

    if (!shareCode) {
      console.error('[toss-webhook] Cannot extract shareCode from orderId:', orderId);
      return json({ ok: true, skipped: true });
    }

    // 토스페이먼츠 API로 결제 상태 재확인 (웹훅 위조 방지)
    const secretKey = Deno.env.get('TOSS_SECRET_KEY');
    if (secretKey) {
      const authHeader = 'Basic ' + btoa(secretKey + ':');
      const verifyRes = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}`, {
        headers: { Authorization: authHeader },
      });
      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        if (verifyData.status !== 'DONE') {
          console.error('[toss-webhook] Payment not DONE on verify:', verifyData.status);
          return json({ ok: true, skipped: true });
        }
      }
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { error } = await supabase
      .from('users')
      .update({ is_paid: true, toss_payment_key: paymentKey })
      .eq('share_code', shareCode);

    if (error) {
      console.error('[toss-webhook] DB update error', error);
      return json({ error: error.message }, 500);
    }

    console.log('[toss-webhook] Marked paid for share_code:', shareCode, 'paymentKey:', paymentKey);
    return json({ ok: true });
  } catch (err) {
    console.error('[toss-webhook]', err);
    return json({ error: String(err) }, 500);
  }
});
