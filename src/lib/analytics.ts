// ── GA4 event helpers ────────────────────────────────────────────
declare function gtag(...args: unknown[]): void;

function track(eventName: string, params?: Record<string, unknown>) {
  if (typeof gtag === 'undefined') return;
  gtag('event', eventName, params ?? {});
}

// ── Funnel events (in order) ─────────────────────────────────────

/** User clicks CTA on Landing and starts the form */
export const trackBeginRegistration = () =>
  track('begin_registration');

/** User successfully submits the Registry form */
export const trackCompleteRegistration = (params: {
  gender: string;
  nationality: string;
}) => track('complete_registration', params);

/** Paywall bottom sheet becomes visible on Reveal page */
export const trackViewPaywall = () =>
  track('view_paywall', { currency: 'USD', value: 4.5 });

/** User clicks "UNLOCK NOW" — initiates checkout */
export const trackBeginCheckout = () =>
  track('begin_checkout', { currency: 'USD', value: 4.5, items: [{ item_id: 'full_script', item_name: 'K-REBORN Full Script', price: 4.5 }] });

/** Payment succeeds — Full Script unlocked */
export const trackPurchase = (params: { transaction_id: string }) =>
  track('purchase', { currency: 'USD', value: 4.5, items: [{ item_id: 'full_script', item_name: 'K-REBORN Full Script', price: 4.5 }], ...params });
