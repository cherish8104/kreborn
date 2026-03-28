import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;
const FN_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const headers = {
  'Content-Type': 'application/json',
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
};

/** 토스페이먼츠 결제창을 열어 결제를 시작합니다 */
export async function requestPayment(shareCode: string, email: string) {
  const tossPayments = await loadTossPayments(CLIENT_KEY);
  const payment = tossPayments.payment({ customerKey: shareCode });

  const orderId = `KREBORN-${shareCode}-${Date.now()}`;

  await payment.requestPayment({
    method: 'CARD',
    amount: { currency: 'KRW', value: 5900 },
    orderId,
    orderName: 'K-REBORN Full Script',
    customerEmail: email,
    successUrl: `${window.location.origin}/reveal?status=success&sc=${shareCode}`,
    failUrl: `${window.location.origin}/reveal?status=fail&sc=${shareCode}`,
  });
}

/** 결제 승인 — 백엔드에서 토스페이먼츠 confirm API 호출 */
export async function confirmPayment(
  paymentKey: string,
  orderId: string,
  amount: number,
  shareCode: string,
): Promise<boolean> {
  try {
    const res = await fetch(`${FN_BASE}/toss-confirm`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ paymentKey, orderId, amount, shareCode }),
    });
    const json = await res.json().catch(() => ({}));
    console.log('[toss-confirm] status:', res.status, 'body:', JSON.stringify(json));
    if (!res.ok) return false;
    return json.paid === true;
  } catch (e) {
    console.error('[toss-confirm] fetch error:', e);
    return false;
  }
}

/** DB에서 is_paid 상태만 확인 (웹훅이 이미 처리한 경우) */
export async function checkPaidStatus(shareCode: string): Promise<boolean> {
  try {
    const res = await fetch(`${FN_BASE}/toss-confirm`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ shareCode, checkOnly: true }),
    });
    const json = await res.json().catch(() => ({}));
    return json.paid === true;
  } catch {
    return false;
  }
}
