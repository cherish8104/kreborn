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
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const errJson = await res.json();
      msg = `[${errJson.error?.status ?? res.status}] ${errJson.error?.message ?? JSON.stringify(errJson)}`;
    } catch { /* body wasn't JSON */ }
    throw new Error(msg);
  }
  const json = await res.json();
  if (json.error) {
    throw new Error(`[${json.error.status ?? res.status}] ${json.error.message}`);
  }
  return json;
}

async function ga4CohortReport(propertyId: string, token: string, body: object) {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runCohortReport`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const errJson = await res.json();
      msg = `cohort: [${errJson.error?.status ?? res.status}] ${errJson.error?.message ?? JSON.stringify(errJson)}`;
    } catch { /* body wasn't JSON */ }
    throw new Error(msg);
  }
  const json = await res.json();
  if (json.error) {
    throw new Error(`cohort: [${json.error.status ?? res.status}] ${json.error.message}`);
  }
  return json;
}

function dateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
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

    const cohortWeeks = [
      { name: '6주전', dimension: 'firstSessionDate', dateRange: { startDate: dateStr(41), endDate: dateStr(35) } },
      { name: '5주전', dimension: 'firstSessionDate', dateRange: { startDate: dateStr(34), endDate: dateStr(28) } },
      { name: '4주전', dimension: 'firstSessionDate', dateRange: { startDate: dateStr(27), endDate: dateStr(21) } },
      { name: '3주전', dimension: 'firstSessionDate', dateRange: { startDate: dateStr(20), endDate: dateStr(14) } },
      { name: '2주전', dimension: 'firstSessionDate', dateRange: { startDate: dateStr(13), endDate: dateStr(7) } },
      { name: '지난주', dimension: 'firstSessionDate', dateRange: { startDate: dateStr(6), endDate: dateStr(0) } },
    ];

    // ── 모든 GA4 API를 병렬로 호출 ──────────────────────────────────────
    const [
      funnelData, dailyData, dailyTrafficData, newVsReturningData,
      landingData, channelData, sourceMediumData, countryData, deviceData,
    ] = await Promise.all([
      ga4Report(propertyId, token, {
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
        dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
        dimensionFilter: { filter: { fieldName: 'eventName', inListFilter: { values: ['page_view', 'begin_registration', 'complete_registration', 'view_paywall', 'begin_checkout', 'purchase'] } } },
      }),
      ga4Report(propertyId, token, {
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'activeUsers' }],
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),
      ga4Report(propertyId, token, {
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'newUsers' }],
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),
      ga4Report(propertyId, token, {
        dimensions: [{ name: 'newVsReturning' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'engagementRate' }],
        dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
      }),
      ga4Report(propertyId, token, {
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }],
        dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
        dimensionFilter: { filter: { fieldName: 'pagePath', stringFilter: { matchType: 'EXACT', value: '/' } } },
      }),
      ga4Report(propertyId, token, {
        dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      }),
      ga4Report(propertyId, token, {
        dimensions: [{ name: 'sessionSourceMedium' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 15,
      }),
      ga4Report(propertyId, token, {
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 8,
      }),
      ga4Report(propertyId, token, {
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
      }),
    ]);

    // Cohort report — run separately so a failure here doesn't break the whole response
    let cohortData: Record<string, unknown> = { rows: [] };
    try {
      cohortData = await ga4CohortReport(propertyId, token, {
        cohortSpec: {
          cohorts: cohortWeeks,
          cohortsRange: { granularity: 'WEEKLY', startOffset: 0, endOffset: 5 },
        },
        dimensions: [{ name: 'cohort' }, { name: 'cohortNthWeek' }],
        metrics: [{ name: 'cohortActiveUsers' }, { name: 'cohortTotalUsers' }],
      });
    } catch (cohortErr) {
      cohortData = { rows: [], error: String(cohortErr) };
    }

    return new Response(
      JSON.stringify({
        funnel: funnelData,
        daily: dailyData,
        dailyTraffic: dailyTrafficData,
        newVsReturning: newVsReturningData,
        landing: landingData,
        channel: channelData,
        sourceMedium: sourceMediumData,
        country: countryData,
        device: deviceData,
        cohort: cohortData,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
