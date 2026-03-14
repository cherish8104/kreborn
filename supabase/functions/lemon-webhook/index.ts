// LemonSqueezy order_created 웹훅 핸들러
// Supabase 시크릿 설정 필요:
//   LEMON_WEBHOOK_SECRET      : LemonSqueezy 웹훅 서명 시크릿
//   SUPABASE_URL              : 자동 주입
//   SUPABASE_SERVICE_ROLE_KEY : 자동 주입

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature',
};

async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  const computed = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return computed === signature;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const secret = Deno.env.get('LEMON_WEBHOOK_SECRET');
    const signature = req.headers.get('x-signature') ?? '';
    const body = await req.text();

    // 서명 검증
    if (secret) {
      const valid = await verifySignature(body, signature, secret);
      if (!valid) {
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const payload = JSON.parse(body);
    const eventName = payload.meta?.event_name;

    // order_created 이벤트만 처리
    if (eventName !== 'order_created') {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const orderData = payload.data;
    const customData = payload.meta?.custom_data;
    const shareCode = customData?.share_code;
    const orderId = String(orderData?.id ?? '');
    const orderStatus = orderData?.attributes?.status;

    if (!shareCode || orderStatus !== 'paid') {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { error } = await supabase
      .from('users')
      .update({ is_paid: true, lemon_order_id: orderId })
      .eq('share_code', shareCode);

    if (error) {
      console.error('[lemon-webhook] DB update error', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('[lemon-webhook] Marked paid for share_code:', shareCode, 'order:', orderId);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[lemon-webhook]', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
