// LemonSqueezy 체크아웃 URL 생성
// Supabase 시크릿 설정 필요:
//   LEMON_API_KEY    : LemonSqueezy API 키 (대시보드 > API Keys)
//   LEMON_STORE_ID   : 스토어 ID (숫자)
//   LEMON_VARIANT_ID : 상품 Variant ID (숫자)
//   APP_URL          : 앱 기본 URL (예: https://kreborn.com)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { shareCode, email } = await req.json();

    const apiKey = Deno.env.get('LEMON_API_KEY');
    const storeId = Deno.env.get('LEMON_STORE_ID');
    const variantId = Deno.env.get('LEMON_VARIANT_ID');
    const appUrl = Deno.env.get('APP_URL') ?? 'https://kreborn.com';

    if (!apiKey || !storeId || !variantId) {
      return new Response(
        JSON.stringify({ error: 'Missing Lemon Squeezy configuration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const body = {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: email || undefined,
            custom: { share_code: shareCode },
          },
          product_options: {
            redirect_url: `${appUrl}/reveal?sc=${encodeURIComponent(shareCode)}`,
          },
        },
        relationships: {
          store: { data: { type: 'stores', id: String(storeId) } },
          variant: { data: { type: 'variants', id: String(variantId) } },
        },
      },
    };

    const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[lemon-checkout] API error', res.status, errText);
      return new Response(
        JSON.stringify({ error: `LemonSqueezy API error: ${res.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const data = await res.json();
    const checkoutUrl = data.data?.attributes?.url;

    return new Response(
      JSON.stringify({ url: checkoutUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('[lemon-checkout]', err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
