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

    if (!shareCode) {
      return new Response(JSON.stringify({ error: 'shareCode required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // orderId가 있으면 LemonSqueezy API로 주문 확인 후 DB 업데이트
    if (orderId) {
      const apiKey = Deno.env.get('LEMON_API_KEY');
      if (apiKey) {
        const orderRes = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: 'application/vnd.api+json',
          },
        });

        if (orderRes.ok) {
          const orderData = await orderRes.json();
          const status = orderData.data?.attributes?.status;
          console.log('[lemon-verify] orderId:', orderId, 'status:', status);

          if (status === 'paid') {
            await supabase
              .from('users')
              .update({ is_paid: true, lemon_order_id: String(orderId) })
              .eq('share_code', shareCode);
            return new Response(JSON.stringify({ paid: true }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }
      }
    }

    // orderId 없거나 API 확인 실패 → DB에서 웹훅 처리 여부 직접 확인
    const { data } = await supabase
      .from('users')
      .select('is_paid')
      .eq('share_code', shareCode)
      .single();

    console.log('[lemon-verify] DB check shareCode:', shareCode, 'is_paid:', data?.is_paid);

    return new Response(JSON.stringify({ paid: data?.is_paid === true }), {
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
