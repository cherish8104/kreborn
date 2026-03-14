// LemonSqueezy 주문 검증 — 결제 후 리다이렉트 시 호출
// Supabase 시크릿 설정 필요:
//   LEMON_API_KEY             : LemonSqueezy API 키
//   SUPABASE_URL              : 자동 주입
//   SUPABASE_SERVICE_ROLE_KEY : 자동 주입

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { orderId, shareCode } = await req.json();

    if (!orderId || !shareCode) {
      return new Response(JSON.stringify({ error: 'orderId and shareCode required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('LEMON_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Missing LEMON_API_KEY' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // LemonSqueezy API로 주문 상태 확인
    const orderRes = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/vnd.api+json',
      },
    });

    if (!orderRes.ok) {
      return new Response(JSON.stringify({ paid: false, error: 'Order not found' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const orderData = await orderRes.json();
    const status = orderData.data?.attributes?.status;
    const orderShareCode = orderData.meta?.custom_data?.share_code;

    // 주문이 실제 paid 상태이고 share_code가 일치하는지 확인
    const isPaid = status === 'paid' && orderShareCode === shareCode;

    if (isPaid) {
      // DB 업데이트 (웹훅이 아직 안 온 경우 대비)
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      );

      await supabase
        .from('users')
        .update({ is_paid: true, lemon_order_id: String(orderId) })
        .eq('share_code', shareCode);
    }

    return new Response(JSON.stringify({ paid: isPaid }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[lemon-verify]', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
