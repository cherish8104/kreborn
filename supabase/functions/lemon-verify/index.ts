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

    const apiKey = Deno.env.get('LEMON_API_KEY');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // ── 1. orderId 있으면 직접 주문 확인 ────────────────────────────
    if (orderId && apiKey) {
      const orderRes = await fetch(`https://api.lemonsqueezy.com/v1/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/vnd.api+json' },
      });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        const status = orderData.data?.attributes?.status;
        console.log('[lemon-verify] orderId:', orderId, 'status:', status);
        if (status === 'paid') {
          await supabase.from('users')
            .update({ is_paid: true, lemon_order_id: String(orderId) })
            .eq('share_code', shareCode);
          return new Response(JSON.stringify({ paid: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }

    // ── 2. DB에서 is_paid 확인 (웹훅이 이미 처리한 경우) ───────────
    const { data: dbUser } = await supabase
      .from('users')
      .select('is_paid, email')
      .eq('share_code', shareCode)
      .single();

    console.log('[lemon-verify] DB is_paid:', dbUser?.is_paid, 'email:', dbUser?.email);

    if (dbUser?.is_paid === true) {
      return new Response(JSON.stringify({ paid: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── 3. 이메일로 LemonSqueezy 주문 목록 조회 (orderId 없는 경우 대비) ──
    if (apiKey && dbUser?.email) {
      const listRes = await fetch(
        `https://api.lemonsqueezy.com/v1/orders?filter[user_email]=${encodeURIComponent(dbUser.email)}&sort=-created_at&page[size]=5`,
        { headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/vnd.api+json' } },
      );
      const listText = await listRes.text();
      console.log('[lemon-verify] orders list status:', listRes.status, 'body:', listText.slice(0, 300));
      if (listRes.ok) {
        const listData = JSON.parse(listText);
        const allOrders = listData.data ?? [];
        const paidOrders = allOrders.filter((o: any) => o.attributes?.status === 'paid');
        console.log('[lemon-verify] total orders:', allOrders.length, 'paid:', paidOrders.length);
        if (paidOrders.length > 0) {
          const latestOrder = paidOrders[0];
          await supabase.from('users')
            .update({ is_paid: true, lemon_order_id: String(latestOrder.id) })
            .eq('share_code', shareCode);
          return new Response(JSON.stringify({ paid: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }
    }

    return new Response(JSON.stringify({ paid: false }), {
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
