const FN_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const headers = {
  'Content-Type': 'application/json',
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
};

/** LemonSqueezy 체크아웃 URL 생성 — 결제 페이지로 리다이렉트할 URL 반환 */
export async function createCheckout(shareCode: string, email: string): Promise<string> {
  const res = await fetch(`${FN_BASE}/lemon-checkout`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ shareCode, email }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error ?? '결제 페이지 생성 실패');
  }

  const { url } = await res.json();
  if (!url) throw new Error('체크아웃 URL을 받지 못했습니다');
  return url;
}

/** 결제 후 리다이렉트 시 주문 ID로 결제 완료 여부 검증 */
export async function verifyOrder(orderId: string, shareCode: string): Promise<boolean> {
  try {
    const res = await fetch(`${FN_BASE}/lemon-verify`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ orderId, shareCode }),
    });
    const json = await res.json().catch(() => ({}));
    console.log('[lemon-verify] status:', res.status, 'body:', JSON.stringify(json));
    if (!res.ok) return false;
    return json.paid === true;
  } catch (e) {
    console.error('[lemon-verify] fetch error:', e);
    return false;
  }
}
