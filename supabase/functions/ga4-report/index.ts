// GA4 Data API proxy — called from Admin dashboard
// Required Supabase secrets:
//   GA4_PROPERTY_ID      : GA4 속성 ID (숫자, e.g. "323456789")
//   GA4_SERVICE_ACCOUNT  : 서비스 계정 JSON 전체 (stringify된 문자열)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s/g, '');
  const binary = atob(b64);
  const buf = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i);
  return buf.buffer;
}

function base64urlEncode(data: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(data)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function b64url(obj: object): string {
  return btoa(JSON.stringify(obj))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessToken(sa: { client_email: string; private_key: string }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url({ alg: 'RS256', typ: 'JWT' });
  const payload = b64url({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  });
  const signingInput = `${header}.${payload}`;

  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(sa.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(signingInput),
  );

  const jwt = `${signingInput}.${base64urlEncode(sig)}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });
  const { access_token, error } = await res.json();
  if (error) throw new Error(`OAuth error: ${error}`);
  return access_token;
}

async function ga4Report(propertyId: string, token: string, body: object) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const propertyId = Deno.env.get('GA4_PROPERTY_ID');
    const saJson = Deno.env.get('GA4_SERVICE_ACCOUNT');

    if (!propertyId || !saJson) {
      return new Response(
        JSON.stringify({ error: 'GA4_PROPERTY_ID 또는 GA4_SERVICE_ACCOUNT 시크릿이 없습니다.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const sa = JSON.parse(saJson);
    const token = await getAccessToken(sa);

    // ── 1. 퍼널 이벤트 카운트 (전체 기간) ───────────────────────────────
    const funnelData = await ga4Report(propertyId, token, {
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          inListFilter: {
            values: [
              'page_view',
              'begin_registration',
              'complete_registration',
              'view_paywall',
              'begin_checkout',
              'purchase',
            ],
          },
        },
      },
    });

    // ── 2. 일별 활성 유저 (최근 7일) ────────────────────────────────────
    const dailyData = await ga4Report(propertyId, token, {
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }],
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    });

    // ── 3. 랜딩 페이지 뷰 ───────────────────────────────────────────────
    const landingData = await ga4Report(propertyId, token, {
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: { matchType: 'EXACT', value: '/' },
        },
      },
    });

    return new Response(
      JSON.stringify({ funnel: funnelData, daily: dailyData, landing: landingData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
