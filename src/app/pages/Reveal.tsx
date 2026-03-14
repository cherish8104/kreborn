import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../store/UserContext';
import { ResultCard } from '../components/ResultCard';
import { trackViewPaywall, trackBeginCheckout, trackPurchase } from '../../lib/analytics';
import { createCheckout, verifyOrder } from '../../lib/lemonsqueezy';

export function Reveal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { identity, userInput, setIsPaid, shareCode } = useUser();
  const [showPaywall, setShowPaywall] = useState(false);
  const [payStep, setPayStep] = useState<'idle' | 'loading' | 'success'>('idle');
  const [countdown, setCountdown] = useState(3);
  const sheetRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [sheetH, setSheetH] = useState(0);

  useEffect(() => {
    if (!identity) { navigate('/registry'); return; }
    const t = setTimeout(() => { setShowPaywall(true); trackViewPaywall(); }, 2200);
    return () => clearTimeout(t);
  }, [identity, navigate]);

  useEffect(() => {
    if (!showPaywall || countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [showPaywall, countdown]);

  /* Measure sheet height so card area gets correct bottom padding */
  useEffect(() => {
    if (!sheetRef.current) return;
    const ro = new ResizeObserver(() => {
      setSheetH(sheetRef.current?.offsetHeight || 0);
    });
    ro.observe(sheetRef.current);
    return () => ro.disconnect();
  }, [showPaywall]);

  // 결제 후 리다이렉트로 돌아왔을 때 자동 검증
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id');
    const scParam = params.get('sc');
    const effectiveShareCode = shareCode ?? scParam;
    const paymentPending = localStorage.getItem('kreborn_payment_pending');

    console.log('[verify] url:', window.location.search, 'orderId:', orderId, 'shareCode:', effectiveShareCode, 'pending:', paymentPending);

    // order_id가 있거나 결제 시작 플래그가 있을 때만 검증
    if (!effectiveShareCode || (!orderId && !paymentPending)) return;

    localStorage.removeItem('kreborn_payment_pending');
    window.history.replaceState({}, '', window.location.pathname);

    setShowPaywall(true);
    setPayStep('loading');

    const oid = orderId ?? null;
    verifyOrder(oid, effectiveShareCode).then((paid) => {
      console.log('[verify] result:', paid);
      if (paid) {
        setPayStep('success');
        trackPurchase({ transaction_id: oid ?? 'unknown' });
        setTimeout(() => { setIsPaid(true); navigate('/full-script'); }, 1800);
      } else {
        // 웹훅 지연 가능성 — 최대 20초 폴링
        let attempts = 0;
        const poll = setInterval(async () => {
          attempts++;
          const retried = await verifyOrder(oid, effectiveShareCode);
          if (retried) {
            clearInterval(poll);
            setPayStep('success');
            trackPurchase({ transaction_id: oid ?? 'unknown' });
            setTimeout(() => { setIsPaid(true); navigate('/full-script'); }, 1800);
          } else if (attempts >= 10) {
            clearInterval(poll);
            setPayStep('idle');
          }
        }, 2000);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareCode]);

  const handleCheckout = async () => {
    if (!shareCode || !userInput) return;
    trackBeginCheckout();
    setPayStep('loading');
    try {
      const url = await createCheckout(shareCode, userInput.email);
      // 결제 후 리다이렉트 시 order_id 없어도 DB 확인 가능하도록 플래그 저장
      localStorage.setItem('kreborn_payment_pending', '1');
      window.location.href = url;
    } catch {
      setPayStep('idle');
    }
  };

  if (!identity || !userInput) return null;

  const FEATURES = [
    { emoji: '⏳', text: t('feature_time', '과거·현재·미래 사주 시간 서사') },
    { emoji: '☯️', text: t('feature_day_master', '일주론 · 일간 심층 분석 리포트') },
    { emoji: '♥', text: t('feature_soulmate', '운명의 짝 · 궁합 점수 & 전체 프로필') },
    { emoji: '🐉', text: t('feature_zodiac', '띠 · 십이지신 완전 분석') },
    { emoji: '📊', text: t('feature_radar', '오행 블루프린트 · 레이더 차트') },
    { emoji: '🌆', text: t('feature_seoul', '서울 동네 + 하루 시나리오') },
    { emoji: '📜', text: t('feature_name', '성명학 · 이름 작명 원리 해설') },
    { emoji: '🪪', text: t('feature_id_card', 'HD 프리미엄 ID 카드') },
  ];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const st = e.currentTarget.scrollTop;
    if (st > lastScrollY.current + 10 && showPaywall && payStep === 'idle') {
      setShowPaywall(false);
    }
    lastScrollY.current = st;
  };

  return (
    /*
     * ── Layout trick ────────────────────────────────────────────────
     * position: relative  →  the bottom sheet uses absolute, not fixed.
     * height: 100svh      →  constrain to viewport, enable overflow scroll.
     * overflow-y: auto    →  card content is scrollable inside.
     *
     * This keeps the sheet pinned to the MOBILE container (430 px),
     * not the full desktop viewport.
     * ────────────────────────────────────────────────────────────────
     */
    <div className="relative w-full"
      onScroll={handleScroll}
      style={{
        height: '100svh', overflowY: 'auto',
        backgroundColor: '#0a0a0a'
      }}>

      {/* ── Top nav ── */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(201,169,110,0.07)' }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: '19px',
          fontWeight: 300, color: '#c9a96e', letterSpacing: '0.15em'
        }}>
          K·REBORN
        </span>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '11px' }}>🇰🇷</span>
          <span style={{
            fontFamily: 'Pretendard, sans-serif', fontSize: '8px',
            color: '#5a4e44', letterSpacing: '0.18em'
          }}>IDENTITY REVEALED</span>
        </div>
      </div>

      {/* ── ResultCard (preview mode) ── */}
      <div className="px-4 pt-5"
        style={{ paddingBottom: showPaywall ? sheetH + 24 : 120 }}>
        <ResultCard identity={identity} userInput={userInput} mode="preview" onUnlock={() => setShowPaywall(true)} />

        {/* ── Reopen Button ── */}
        <AnimatePresence>
          {!showPaywall && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="flex justify-center mt-12 mb-8"
            >
              <button onClick={() => setShowPaywall(true)}
                style={{
                  padding: '16px 32px', fontFamily: 'Pretendard, sans-serif',
                  fontSize: '14px', letterSpacing: '0.1em', cursor: 'pointer',
                  color: '#0a0a0a', fontWeight: 500,
                  background: 'linear-gradient(135deg, #c9a96e, #a07840)',
                  border: 'none', borderRadius: '30px',
                  boxShadow: '0 4px 20px rgba(201,169,110,0.2)'
                }}>
                {t('btn_check_after_payment', '결제 후 확인하기')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── PAYMENT BOTTOM SHEET ── */}
      <AnimatePresence>
        {showPaywall && (
          <>
            {/* Scrim Overlay acting as a click-to-close trap */}
            <motion.div
              onClick={() => { if (payStep === 'idle') setShowPaywall(false); }}
              style={{
                position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
                zIndex: 40, cursor: 'pointer'
              }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            </motion.div>

            <motion.div
              ref={sheetRef}
              /* absolute → relative to the page container (MobileLayout's 430 px div) */
              style={{
                position: 'sticky', bottom: 0, left: 0, right: 0, zIndex: 50,
                width: '100%'
              }}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 290, damping: 32 }}>

              {/* Gradient above sheet */}
              <div className="pointer-events-none"
                style={{
                  position: 'absolute', bottom: '100%', left: 0, right: 0, height: 80,
                  background: 'linear-gradient(to top, rgba(10,10,10,0.96), transparent)'
                }} />

              <div style={{
                background: 'rgba(12,10,8,0.99)', backdropFilter: 'blur(24px)',
                borderTop: '1px solid rgba(201,169,110,0.28)',
                borderRadius: '20px 20px 0 0'
              }}>

                {/* Handle */}
                <div className="flex justify-center pt-3.5 mb-1">
                  <div style={{
                    width: 34, height: 3.5, borderRadius: 2,
                    background: 'rgba(201,169,110,0.22)'
                  }} />
                </div>

                <div className="px-5 pb-10 pt-3">

                  {/* ─ IDLE ─ */}
                  {payStep === 'idle' && (
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p style={{
                            fontFamily: 'Pretendard, sans-serif', fontSize: '10px',
                            color: '#c9a96e', letterSpacing: '0.14em', marginBottom: 3
                          }}>
                            🇰🇷 UNLOCK COMPLETE IDENTITY
                          </p>
                          <h3 style={{
                            fontFamily: "'Cormorant Garamond', serif", fontSize: '22px',
                            fontWeight: 300, color: '#f5f0e8', lineHeight: 1.2
                          }}>
                            Parallel Life Full Script
                          </h3>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p style={{
                            fontFamily: "'Cormorant Garamond', serif", fontSize: '26px',
                            color: '#c9a96e', lineHeight: 1
                          }}>$4.5</p>
                          <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#a39481' }}>₩5,900</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-5">
                        {FEATURES.map(f => (
                          <div key={f.text} className="flex items-center gap-2 px-3 py-2.5"
                            style={{
                              border: '1px solid rgba(201,169,110,0.2)',
                              background: 'rgba(201,169,110,0.05)',
                              borderRadius: '6px'
                            }}>
                            <span style={{ fontSize: '13px', flexShrink: 0 }}>{f.emoji}</span>
                            <span style={{
                              fontFamily: 'Pretendard, sans-serif', fontSize: '11px',
                              color: '#e6e0d4', lineHeight: 1.4
                            }}>{f.text}</span>
                          </div>
                        ))}
                      </div>

                      <motion.button onClick={handleCheckout} className="w-full mb-3"
                        style={{
                          padding: '15px', fontFamily: 'Pretendard, sans-serif',
                          fontSize: '12px', letterSpacing: '0.15em', cursor: 'pointer',
                          color: '#0a0a0a',
                          background: 'linear-gradient(135deg, #c9a96e, #a07840)',
                          border: 'none', borderRadius: '6px'
                        }}
                        whileTap={{ scale: 0.97 }}>
                        UNLOCK NOW — ₩5,900
                      </motion.button>

                      {countdown > 0 && (
                        <p className="text-center"
                          style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#a39481' }}>
                          ⏳ {t('msg_script_expires_in', '결과 스크립트가 {{min}}분 후 만료됩니다', { min: countdown })}
                        </p>
                      )}
                    </>
                  )}

                  {/* ─ LOADING ─ */}
                  {payStep === 'loading' && (
                    <div className="flex flex-col items-center py-8">
                      <motion.div className="w-9 h-9 rounded-full mb-4"
                        style={{ border: '2px solid rgba(201,169,110,0.3)', borderTopColor: '#c9a96e' }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }} />
                      <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '13px', color: '#e6e0d4' }}>
                        Verifying payment…
                      </p>
                    </div>
                  )}

                  {/* ─ SUCCESS ─ */}
                  {payStep === 'success' && (
                    <motion.div className="flex flex-col items-center py-8"
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                      <div className="w-12 h-12 flex items-center justify-center mb-4 rounded-full"
                        style={{
                          border: '1px solid rgba(201,169,110,0.55)',
                          background: 'rgba(201,169,110,0.1)'
                        }}>
                        <motion.span style={{ color: '#c9a96e', fontSize: '22px' }}
                          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.7 }}>✓</motion.span>
                      </div>
                      <p style={{
                        fontFamily: "'Cormorant Garamond', serif", fontSize: '22px',
                        color: '#f5f0e8', fontStyle: 'italic'
                      }}>Identity Unlocked</p>
                      <p style={{
                        fontFamily: 'Pretendard, sans-serif', fontSize: '11px',
                        color: '#a39481', marginTop: 6
                      }}>Opening your Full Script…</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}