import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useUser } from '../store/UserContext';
import { ResultCard } from '../components/ResultCard';
// TODO: 토스페이먼츠 결제 연동 후 아래 import 복원
// import { trackViewPaywall, trackBeginCheckout, trackPurchase } from '../../lib/analytics';
// import { requestPayment, confirmPayment, checkPaidStatus } from '../../lib/tosspayments';

export function Reveal() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { identity, userInput } = useUser();

  useEffect(() => {
    if (!identity) { navigate('/registry'); return; }
    // TODO: 토스페이먼츠 결제 연동 후 페이월 복원
    // 현재는 결제 없이 2.2초 후 바로 full-script로 이동
    const timer = setTimeout(() => { navigate('/full-script'); }, 2200);
    return () => clearTimeout(timer);
  }, [identity, navigate]);

  if (!identity || !userInput) return null;

  return (
    <div className="relative w-full"
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

      {/* ── ResultCard (preview → 결제 연동 전이라 full로 전환 예정) ── */}
      <div className="px-4 pt-5" style={{ paddingBottom: 120 }}>
        <ResultCard identity={identity} userInput={userInput} mode="preview" onUnlock={() => navigate('/full-script')} />
      </div>
    </div>
  );
}
