import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { getUserByShareCode } from '../../lib/contentApi';
import { ELEMENT_LABELS, ElementEn } from '../utils/sajuEngine';
import { getNarrative } from '../utils/narrativeContent';
import { ResultCard } from '../components/ResultCard';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
} from 'recharts';

const SEOUL_NIGHT = 'https://images.unsplash.com/photo-1634719887228-9936cb61cba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZW91bCUyMEtvcmVhJTIwY2l0eSUyMG5pZ2h0JTIwbHV4dXJ5JTIwYm9rZWh8ZW58MXx8fHwxNzcyNzQyMjkwfDA&ixlib=rb-4.1.0&q=80&w=1080';
const BUKCHON_IMG = 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCdWtjaG9uJTIwaGFub2slMjBTZW91bCUyMHRyYWRpdGlvbmFsJTIwa29yZWFufGVufDF8fHx8MTc3Mjc0MjI5MHww&ixlib=rb-4.1.0&q=80&w=1080';

/* ── SectionTitle ── */
function SectionTitle({ title, titleKr, emoji }: { title: string; titleKr: string; emoji?: string }) {
  return (
    <motion.div className="flex items-center gap-3 mb-5"
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.7 }}>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.25))' }} />
      <div className="text-center">
        {emoji && <p style={{ fontSize: '18px', marginBottom: 2 }}>{emoji}</p>}
        <p style={{
          fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#bba689',
          letterSpacing: '0.2em', textTransform: 'uppercase'
        }}>{titleKr}</p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: '20px',
          fontWeight: 300, color: '#c9a96e', letterSpacing: '0.06em'
        }}>{title}</h2>
      </div>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.25))' }} />
    </motion.div>
  );
}

const CustomRadarTick = (props: { x?: number; y?: number; index?: number }) => {
  const { x = 0, y = 0, index = 0 } = props;
  const labels = ['木 목', '火 화', '土 토', '金 금', '水 수'];
  const colors = ['#4ade80', '#fb923c', '#fbbf24', '#e2e8f0', '#60a5fa'];
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
      style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 13,
        fill: colors[index], fontWeight: 500
      }}>
      {labels[index]}
    </text>
  );
};

function KoreanBorder({ children, color = 'rgba(201,169,110,0.18)' }: {
  children: React.ReactNode; color?: string;
}) {
  return (
    <div className="relative" style={{ border: `1px solid ${color}`, padding: 1 }}>
      <div style={{ border: `1px solid ${color}` }}>
        {children}
      </div>
    </div>
  );
}

export function SharedResult() {
  const navigate = useNavigate();
  const { code } = useParams<{ code: string }>();
  const { t } = useTranslation();

  const [data, setData] = useState<any>(null);
  const [narrative, setNarrative] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!code) { setNotFound(true); setLoading(false); return; }
    getUserByShareCode(code).then(async (result) => {
      if (!result) {
        setNotFound(true);
        setLoading(false);
      } else {
        setData(result);
        if (result.identity_data && result.identity_data.saju) {
          try {
            const narr = await getNarrative(result.identity_data.saju);
            setNarrative(narr);
          } catch (err) {
            console.error(err);
          }
        }
        setLoading(false);
      }
    });
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <motion.div className="w-9 h-9 rounded-full"
          style={{ border: '2px solid rgba(201,169,110,0.3)', borderTopColor: '#c9a96e' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.75, repeat: Infinity, ease: 'linear' }} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#0a0a0a' }}>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', color: '#c9a96e' }}>K·REBORN</p>
        <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '14px', color: '#5a4e44' }}>
          {t('sr_not_found', '결과를 찾을 수 없습니다')}
        </p>
        <a href="/" style={{
          fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#c9a96e',
          textDecoration: 'none', letterSpacing: '0.1em'
        }}>
          {t('sr_find_identity_btn', '나의 정체성 알아보기 →')}
        </a>
      </div>
    );
  }

  const identity = data?.identity_data;
  const userInput = data?.user_input_data;

  if (!identity || !userInput || !narrative) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <p className="text-[#c9a96e] font-serif italic text-lg animate-pulse">{t('sr_consulting', 'Consulting the stars...')}</p>
    </div>
  );

  const { saju, elementRadar, soulmate, neighborhood } = identity;
  const elLabel = ELEMENT_LABELS[saju.lackingElement as ElementEn];
  const domLabel = ELEMENT_LABELS[saju.dominantElement as ElementEn];

  const { zodiac, dayMaster, scenario, pastData, youthData, futureData, gyeokguk, pastLife, kDrama, luckyData } = narrative;

  return (
    <div className="max-w-md mx-auto shadow-2xl relative bg-[#0a0a0a]" style={{ minHeight: '100svh' }}>
      <div id="full-script-container" className="min-h-screen w-full" style={{ backgroundColor: '#0a0a0a' }}>

        {/* ── Hero ── */}
        <div className="relative w-full overflow-hidden" style={{ height: 240 }}>
          <img src={SEOUL_NIGHT} alt="Seoul" className="w-full h-full object-cover"
            style={{ opacity: 0.3, filter: 'saturate(0.6)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.2), #0a0a0a)' }} />

          <div className="absolute top-0 left-0 right-0" style={{ height: 3 }}>
            {['#C8102E', '#fbbf24', '#4ade80', '#60a5fa', '#C8102E'].map((c, i) => (
              <div key={i} className="inline-block" style={{ width: '20%', height: '100%', background: c }} />
            ))}
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              className="flex flex-col items-center gap-1 mb-3">
              <span style={{
                fontFamily: 'Pretendard, sans-serif', fontSize: '8px',
                color: '#bba689', letterSpacing: '0.22em'
              }}>🇰🇷 {t('sr_parallel_identity', '대한민국 평행 정체성')}</span>
              <span style={{
                fontFamily: 'Pretendard, sans-serif', fontSize: '13px',
                color: '#c9a96e', letterSpacing: '0.06em'
              }}>
                {userInput.name}{t('sr_custom_name', '님만을 위한 한국 이름입니다')}
              </span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: '52px',
                fontWeight: 300, color: '#f5f0e8', lineHeight: 1
              }}>
              {identity.fullName}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: '15px',
                fontStyle: 'italic', color: '#e8dcca', marginTop: 5
              }}>
              {identity.fullNameRomanized}
            </motion.p>
            <motion.div className="mt-4 flex flex-wrap gap-2 justify-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
              <span style={{
                background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.26)',
                fontFamily: 'Pretendard, sans-serif', fontSize: '9px',
                color: '#c9a96e', padding: '2px 9px'
              }}>{identity.careerKr}</span>
              <span style={{
                background: `${domLabel.color}10`, border: `1px solid ${domLabel.color}25`,
                fontFamily: 'Pretendard, sans-serif', fontSize: '9px',
                color: domLabel.color, padding: '2px 9px'
              }}>
                {domLabel.char} {domLabel.kr} {t('sr_dominant_energy', 'Dominant')}
              </span>
              <span style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'Pretendard, sans-serif', fontSize: '9px',
                color: '#e8dcca', padding: '2px 9px'
              }}>
                {zodiac.emoji} {zodiac.kr}
              </span>
            </motion.div>
          </div>
        </div>

        <div className="px-4 pt-6 pb-16 flex flex-col gap-9">

          {/* ── [1] IDENTITY CARD ─────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75 }}>
            <ResultCard identity={identity} userInput={userInput} mode="full" />
          </motion.div>

          {/* ── [2] 과거·현재·미래 ────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionTitle title="Past · Present · Future" titleKr={t('sr_past_present_future', '과거 · 현재 · 미래 · 사주 시간의 서사')} emoji="⏳" />

            <div className="relative">
              <div className="absolute left-[22px] top-0 bottom-0 w-px"
                style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,169,110,0.35) 10%, rgba(201,169,110,0.35) 90%, transparent)' }} />

              {/* 과거 (년주) */}
              <motion.div className="relative flex gap-4 mb-6"
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.05 }}>
                <div className="shrink-0 w-11 h-11 flex flex-col items-center justify-center z-10"
                  style={{ border: '1px solid rgba(201,169,110,0.35)', background: '#0a0a0a' }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: '#bba689', lineHeight: 1 }}>年</span>
                  <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '6px', color: '#8a7255', marginTop: 1 }}>{t('sr_past', '과거')}</span>
                </div>
                <div className="flex-1 pt-1 pb-5" style={{ borderBottom: '1px solid rgba(201,169,110,0.07)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#bba689', lineHeight: 1 }}>{saju.year.stem}{saju.year.branch}</span>
                    <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#8a7255', letterSpacing: '0.12em' }}>{t('sr_year_pillar_childhood', '년주 · 유년기')}</span>
                  </div>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#bba689', letterSpacing: '0.1em', marginBottom: 6 }}>{pastData.keyword}</p>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', color: '#e8dcca', fontWeight: 300, marginBottom: 8 }}>{pastData.title}</h4>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#d1c5b4', lineHeight: 1.85 }}>{pastData.narrative}</p>
                  <div className="mt-4 p-3" style={{ border: '1px solid rgba(201,169,110,0.07)', background: 'rgba(201,169,110,0.015)' }}>
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#8a7255', letterSpacing: '0.12em', marginBottom: 6 }}>月柱 · {youthData.keyword} ({saju.month.stem}{saju.month.branch})</p>
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#bba689', letterSpacing: '0.08em', marginBottom: 5 }}>{youthData.keyword}</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px', color: '#d1c5b4', fontWeight: 300, marginBottom: 6 }}>{youthData.title}</p>
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#bba689', lineHeight: 1.8 }}>{youthData.narrative}</p>
                  </div>
                </div>
              </motion.div>

              {/* 현재 (일주) */}
              <motion.div className="relative flex gap-4 mb-6"
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.15 }}>
                <div className="shrink-0 w-11 h-11 flex flex-col items-center justify-center z-10"
                  style={{ border: `1px solid ${dayMaster.luckyColorHex}55`, background: 'linear-gradient(145deg, rgba(201,169,110,0.12), rgba(201,169,110,0.03))' }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: '#c9a96e', lineHeight: 1 }}>日</span>
                  <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '6px', color: '#c9a96e', marginTop: 1 }}>{t('sr_present', '현재')}</span>
                </div>
                <div className="flex-1 pt-1 pb-5" style={{ borderBottom: '1px solid rgba(201,169,110,0.07)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#c9a96e', lineHeight: 1 }}>{saju.day.stem}{saju.day.branch}</span>
                    <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#bba689', letterSpacing: '0.12em' }}>{t('sr_day_pillar_now', '일주 · 현재의 나')}</span>
                  </div>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#c9a96e', letterSpacing: '0.1em', marginBottom: 6, opacity: 0.8 }}>{t('sr_now_moment', 'NOW · 지금 이 순간')}</p>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', color: '#f5f0e8', fontWeight: 300, marginBottom: 8 }}>{dayMaster.title} — {dayMaster.nature}</h4>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#e8dcca', lineHeight: 1.85, marginBottom: 10 }}>{identity.personality}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: t('sr_dominant_energy', '주도 기운'), val: `${domLabel.char} ${domLabel.kr}`, color: domLabel.color },
                      { label: t('sr_supplementary_energy', '보충 기운'), val: `${elLabel.char} ${elLabel.kr}`, color: elLabel.color },
                      { label: t('sr_day_master', '일간'), val: dayMaster.hanja, color: '#c9a96e' },
                    ].map(item => (
                      <div key={item.label} className="p-2.5 text-center"
                        style={{ border: `1px solid ${item.color}20`, background: `${item.color}06` }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: item.color, lineHeight: 1, marginBottom: 3 }}>{item.val}</p>
                        <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px', color: '#8a7255' }}>{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* 미래 (시주) */}
              <motion.div className="relative flex gap-4"
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.25 }}>
                <div className="shrink-0 w-11 h-11 flex flex-col items-center justify-center z-10 relative overflow-hidden"
                  style={{ border: '1px solid rgba(201,169,110,0.25)', background: 'rgba(201,169,110,0.04)' }}>
                  <motion.div className="absolute inset-0"
                    style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.2) 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: 'rgba(201,169,110,0.55)', lineHeight: 1, position: 'relative', zIndex: 1 }}>時</span>
                  <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '6px', color: 'rgba(201,169,110,0.4)', marginTop: 1, position: 'relative', zIndex: 1 }}>{t('sr_future', '미래')}</span>
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: 'rgba(201,169,110,0.8)', lineHeight: 1 }}>{saju.hour.stem}{saju.hour.branch}</span>
                    <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#8a7255', letterSpacing: '0.12em' }}>{t('sr_hour_pillar_future', '시주 · 미래의 나')}</span>
                  </div>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#8a7255', letterSpacing: '0.1em', marginBottom: 6 }}>{futureData.keyword} · {t('sr_peak_time', '절정의 시기')} {futureData.peak}</p>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', color: '#c9a96e', fontWeight: 300, marginBottom: 8, opacity: 0.8 }}>{futureData.title}</h4>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#d1c5b4', lineHeight: 1.85, marginBottom: 14 }}>{futureData.narrative}</p>
                  <div className="p-4 relative overflow-hidden"
                    style={{ border: '1px solid rgba(201,169,110,0.2)', background: 'linear-gradient(135deg, rgba(201,169,110,0.06), rgba(201,169,110,0.01))' }}>
                    <motion.div className="absolute -right-4 -top-4 w-20 h-20 rounded-full pointer-events-none"
                      style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)' }}
                      animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }} />
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#bba689', letterSpacing: '0.18em', marginBottom: 6 }}>✦ {t('sr_peak_time', '절정의 시기')}</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', color: '#c9a96e', lineHeight: 1, marginBottom: 4 }}>{futureData.peak}</p>
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: '#bba689', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      {t('sr_in_korea_you_will', '한국에서라면 이 시기에 당신은\n')}<span style={{ color: '#e8dcca' }}>"{dayMaster.koreanStyle}"</span>{t('sr_with', '으로\n')}
                      {t('sr_reach_peak', '인생의 정점을 맞이합니다.')}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* ── [3] 일주론 ──────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionTitle title="Day Master Analysis" titleKr={t('sr_day_master_analysis', '일주론 · 일간 심층 분석')} emoji="☯️" />
            <KoreanBorder>
              <div className="p-4" style={{ background: 'rgba(255,255,255,0.01)' }}>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 flex flex-col items-center justify-center shrink-0"
                    style={{ border: '1px solid rgba(201,169,110,0.35)', background: 'linear-gradient(145deg, rgba(201,169,110,0.1), rgba(201,169,110,0.03))' }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', color: '#c9a96e', lineHeight: 1 }}>{dayMaster.hanja}</span>
                    <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px', color: '#bba689', marginTop: 2 }}>{t('sr_day_master', '일간')}</span>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#bba689', letterSpacing: '0.15em', marginBottom: 3 }}>DAY MASTER</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#f5f0e8', fontWeight: 300, lineHeight: 1.1 }}>{dayMaster.title}</p>
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: '#e8dcca', marginTop: 2 }}>{t('sr_nature', '자연물')}: {dayMaster.nature} · {t('sr_in_korea', '한국에서라면')} "{dayMaster.koreanStyle}"</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3" style={{ border: '1px solid rgba(74,222,128,0.15)', background: 'rgba(74,222,128,0.03)' }}>
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#4ade80', letterSpacing: '0.15em', marginBottom: 8 }}>✦ {t('sr_strength', '강점')}</p>
                    {dayMaster.strength.map((s: string) => (
                      <p key={s} style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#d1c5b4', marginBottom: 5, lineHeight: 1.5 }}>· {s}</p>
                    ))}
                  </div>
                  <div className="p-3" style={{ border: '1px solid rgba(251,146,60,0.15)', background: 'rgba(251,146,60,0.03)' }}>
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#fb923c', letterSpacing: '0.15em', marginBottom: 8 }}>⚠ {t('sr_caution', '주의')}</p>
                    {dayMaster.caution.map((c: string) => (
                      <p key={c} style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#d1c5b4', marginBottom: 5, lineHeight: 1.5 }}>· {c}</p>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(201,169,110,0.08)', paddingTop: 14 }}>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#8a7255', letterSpacing: '0.15em', marginBottom: 10 }}>{t('sr_lucky_energy', '행운의 기운')}</p>
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex items-center gap-2 px-3 py-2"
                      style={{ border: `1px solid ${dayMaster.luckyColorHex}28`, background: `${dayMaster.luckyColorHex}07` }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: dayMaster.luckyColorHex }} />
                      <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#e8dcca' }}>{t('sr_lucky_color', '행운색')}: {dayMaster.luckyColor}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2"
                      style={{ border: '1px solid rgba(201,169,110,0.15)', background: 'rgba(201,169,110,0.04)' }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: '#c9a96e', lineHeight: 1 }}>{dayMaster.luckyNumber}</span>
                      <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#e8dcca' }}>{t('sr_lucky_number', '행운 숫자')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </KoreanBorder>
          </motion.div>

          {/* ── [3.5] 조선시대 전생 ────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionTitle title="Past Life in Joseon" titleKr={t('sr_past_life', '조선시대 전생의 기억')} emoji="📜" />
            <div className="p-4" style={{ border: '1px solid rgba(201,169,110,0.13)', background: 'linear-gradient(180deg, rgba(201,169,110,0.04), rgba(201,169,110,0.01))' }}>
              <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#bba689', letterSpacing: '0.15em', marginBottom: 4 }}>PAST LIFE CONNECTION</p>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 400, color: '#f5f0e8', lineHeight: 1.2, marginBottom: 2 }}>
                {pastLife.title}
              </h3>
              <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#c9a96e', marginBottom: 10 }}>{pastLife.role}</p>

              <div style={{ height: 1, background: 'rgba(201,169,110,0.08)', marginBottom: 12 }} />
              <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#e8dcca', lineHeight: 1.8 }}>
                {pastLife.desc}
              </p>
            </div>
          </motion.div>

          {/* ── [4] 사주 블루프린트 ──────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionTitle title="Saju Blueprint" titleKr={t('sr_saju_blueprint', '사주 블루프린트 · 오행 밸런스')} />
            <div className="p-4 mb-4" style={{ border: `1px solid ${domLabel.color}22`, background: `linear-gradient(145deg, ${domLabel.color}06, transparent)` }}>
              <div className="flex items-center gap-3 mb-3">
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', color: domLabel.color, lineHeight: 1 }}>{domLabel.char}</span>
                <div>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#bba689', letterSpacing: '0.15em', marginBottom: 2 }}>{t('sr_gyeokguk', '격국(格局)')}</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: domLabel.color, fontWeight: 300 }}>{gyeokguk.hanja}</p>
                </div>
              </div>
              <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#d1c5b4', lineHeight: 1.8 }}>{gyeokguk.desc}</p>
            </div>
            <div className="p-4" style={{ border: '1px solid rgba(201,169,110,0.13)', background: 'rgba(255,255,255,0.01)' }}>
              <div style={{ height: 230 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={elementRadar} margin={{ top: 16, right: 22, bottom: 16, left: 22 }}>
                    <PolarGrid stroke="rgba(201,169,110,0.1)" />
                    <PolarAngleAxis dataKey="element" tick={CustomRadarTick as any} />
                    <Radar name="Element" dataKey="value" stroke="#c9a96e"
                      fill="#c9a96e" fillOpacity={0.1} strokeWidth={1.5} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col gap-2.5 mt-3">
                {elementRadar.map((el: any) => {
                  const elKey = ['wood', 'fire', 'earth', 'metal', 'water'][
                    ['木', '火', '土', '金', '水'].indexOf(el.element)
                  ] as keyof typeof ELEMENT_LABELS;
                  const color = ELEMENT_LABELS[elKey]?.color || '#c9a96e';
                  return (
                    <div key={el.element} className="flex items-center gap-2.5">
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '14px', color, lineHeight: 1, minWidth: 16 }}>{el.element}</span>
                      <div className="flex-1 relative" style={{ height: 3, background: 'rgba(255,255,255,0.05)' }}>
                        <motion.div className="absolute inset-y-0 left-0 ohaeng-bar" style={{ background: color, opacity: 0.65 }}
                          data-target-width={`${el.value}%`}
                          initial={{ width: 0 }} whileInView={{ width: `${el.value}%` }}
                          viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15 }} />
                      </div>
                      <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: '#bba689', minWidth: 30, textAlign: 'right' }}>{el.value}%</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-3" style={{ background: 'rgba(201,169,110,0.025)', border: '1px solid rgba(201,169,110,0.08)' }}>
                <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#d1c5b4', lineHeight: 1.8 }}>
                  <span style={{ color: domLabel.color }}>{domLabel.char}({domLabel.kr})</span> {t('sr_dominant_saju', '기운이 우세한 사주.')}
                  {t('sr_lacking_saju', '용신(부족한 기운)은')} <span style={{ color: elLabel.color }}>{elLabel.char}({elLabel.kr})</span>.
                  {t('sr_name', '이름')} <strong style={{ color: '#c9a96e', fontFamily: "'Cormorant Garamond', serif" }}>{identity.fullName}</strong>{t('sr_name_completes', '은 이 부족한 기운을 음운학적으로 보강합니다.')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── [5] 띠 ─────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionTitle title={`${zodiac.animal} Year`} titleKr={`${zodiac.kr}${t('sr_zodiac_analysis', '띠 · 십이지신 분석')}`} emoji={zodiac.emoji} />
            <KoreanBorder>
              <div className="p-5" style={{ background: 'rgba(255,255,255,0.01)' }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 flex items-center justify-center shrink-0"
                    style={{ border: '1px solid rgba(201,169,110,0.2)', background: 'rgba(201,169,110,0.04)', fontSize: '32px' }}>
                    {zodiac.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#f5f0e8', fontWeight: 300 }}>{zodiac.kr}띠</span>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#8a7255', fontWeight: 300 }}>({saju.year.branch})</span>
                    </div>
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#bba689' }}>{zodiac.animal} Year</p>
                  </div>
                </div>
                <div style={{ height: 1, background: 'rgba(201,169,110,0.08)', marginBottom: 14 }} />
                <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#e8dcca', lineHeight: 1.85 }}>{zodiac.trait}</p>
                <div className="mt-4 p-3" style={{ border: '1px solid rgba(201,169,110,0.1)', background: 'rgba(201,169,110,0.02)' }}>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#8a7255', letterSpacing: '0.15em', marginBottom: 8 }}>{t('sr_korean_zodiac_comp', '한국에서의 띠 궁합')}</p>
                  <div className="flex gap-2 flex-wrap">
                    {(['🐉', '🐒', '🐂'].map((e, i) => (
                      <span key={i} style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#d1c5b4', padding: '3px 8px', border: '1px solid rgba(201,169,110,0.12)' }}>
                        {e} {t('sr_good_comp', '좋은 궁합')}
                      </span>
                    )))}
                  </div>
                </div>
              </div>
            </KoreanBorder>
          </motion.div>

          {/* ── [6] 직업 성향 ──────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionTitle title="Career & Personality" titleKr={t('sr_career_personality', '직업 성향 · 인격 분석')} emoji="💼" />
            <div className="p-4" style={{ border: '1px solid rgba(201,169,110,0.13)', background: 'rgba(255,255,255,0.01)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 flex items-center justify-center shrink-0"
                  style={{ border: '1px solid rgba(201,169,110,0.28)', background: 'rgba(201,169,110,0.07)' }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: '#c9a96e' }}>{saju.day.stem}</span>
                </div>
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', color: '#f5f0e8', fontWeight: 300 }}>{identity.career}</p>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: '#bba689' }}>{identity.careerKr} · {t('sr_day_master', '일간')} {saju.day.stem}({saju.day.stemKr})</p>
                </div>
              </div>
              <div style={{ height: 1, background: 'rgba(201,169,110,0.08)', marginBottom: 12 }} />
              <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#e8dcca', lineHeight: 1.85 }}>{identity.careerDescription}</p>
              <div style={{ height: 1, background: 'rgba(201,169,110,0.08)', margin: '12px 0' }} />
              <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#d1c5b4', lineHeight: 1.8, fontStyle: 'italic' }}>{identity.personality}</p>
            </div>
          </motion.div>

          {/* ── [6.5] K-드라마 페르소나 ────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionTitle title="K-Drama Persona" titleKr={t('sr_kdrama_persona', '나의 K-드라마 캐릭터')} emoji="🎬" />
            <div className="p-4 relative overflow-hidden" style={{ border: '1px solid rgba(201,169,110,0.13)', background: 'rgba(255,255,255,0.01)' }}>
              <div className="absolute -right-4 -bottom-4 w-24 h-24" style={{ background: `radial-gradient(circle, ${domLabel.color}15 0%, transparent 70%)` }} />
              <div className="flex flex-col gap-1 mb-4">
                <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: domLabel.color, letterSpacing: '0.1em' }}>
                  {domLabel.char} {domLabel.kr} ENERGY
                </span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: 300, color: '#f5f0e8' }}>
                  {kDrama.archetype}
                </h3>
                <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#c9a96e' }}>
                  "{kDrama.trope}"
                </p>
              </div>
              <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#e8dcca', lineHeight: 1.8, position: 'relative', zIndex: 1 }}>
                {kDrama.desc}
              </p>
            </div>
          </motion.div>

          {/* ── [7] 서울 하루 시나리오 ─────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionTitle title="A Day in Seoul" titleKr={t('sr_day_in_seoul', '서울에서의 하루 · 평행우주 시나리오')} emoji="🌆" />
            <div className="relative overflow-hidden" style={{ border: '1px solid rgba(201,169,110,0.15)' }}>
              <img src={BUKCHON_IMG} alt="Seoul" className="w-full object-cover"
                style={{ height: 120, opacity: 0.2, filter: 'saturate(0.5)' }} />
              <div className="absolute inset-0 top-0" style={{ height: 120, background: 'linear-gradient(to bottom, transparent, rgba(10,10,10,0.95))' }} />
              <div className="px-4 pb-4" style={{ marginTop: -20 }}>
                {[
                  { time: `🌅 ${t('sr_morning', '아침')}`, icon: '🌅', text: scenario.morning },
                  { time: `☀️ ${t('sr_afternoon', '낮')}`, icon: '☀️', text: scenario.afternoon },
                  { time: `🌙 ${t('sr_evening', '저녁')}`, icon: '🌙', text: scenario.evening },
                ].map((s, i) => (
                  <motion.div key={s.time} className="mb-4"
                    initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6 }}>
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5 w-6 h-6 flex items-center justify-center"
                        style={{ border: '1px solid rgba(201,169,110,0.18)', background: 'rgba(201,169,110,0.04)', fontSize: '12px' }}>
                        {s.icon}
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#bba689', letterSpacing: '0.12em', marginBottom: 4 }}>{s.time}</p>
                        <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#e8dcca', lineHeight: 1.8 }}>{s.text}</p>
                      </div>
                    </div>
                    {i < 2 && <div style={{ height: 1, background: 'rgba(201,169,110,0.07)', marginTop: 12 }} />}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── [8] 운명의 짝 ─────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionTitle title="The Soulmate" titleKr={t('sr_soulmate_comp', '운명의 짝 · 사주 궁합')} emoji="♥" />
            <div className="p-4 relative overflow-hidden"
              style={{ border: '1px solid rgba(201,169,110,0.18)', background: 'rgba(255,255,255,0.01)' }}>
              <div className="absolute top-0 right-0 w-28 h-28 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)' }} />
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#bba689', letterSpacing: '0.18em', marginBottom: 3 }}>DESTINY MATCH</p>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '30px', fontWeight: 400, color: '#f5f0e8', lineHeight: 1 }}>{soulmate.name}</h3>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', fontStyle: 'italic', color: '#e8dcca', marginTop: 1 }}>{soulmate.nameRomanized}</p>
                </div>
                <div className="text-center shrink-0 ml-3">
                  <div style={{ width: 52, height: 52, border: '1px solid rgba(201,169,110,0.35)', background: 'rgba(201,169,110,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#c9a96e' }}>{soulmate.compatibilityScore}</span>
                  </div>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px', color: '#8a7255', marginTop: 3 }}>{t('sr_comp_score', '궁합 점수')}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {[soulmate.trait1, soulmate.trait2, soulmate.trait3].map((t: string) => (
                  <span key={t} style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#e8dcca', padding: '2px 8px', border: '1px solid rgba(201,169,110,0.15)', background: 'rgba(201,169,110,0.03)' }}>{t}</span>
                ))}
              </div>
              <div style={{ height: 1, background: 'rgba(201,169,110,0.08)', marginBottom: 12 }} />
              <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#d1c5b4', lineHeight: 1.85 }}>{soulmate.description}</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { label: t('sr_emotional_comp', '정서 궁합'), score: Math.min(99, soulmate.compatibilityScore + 3) },
                  { label: t('sr_value_comp', '가치관 궁합'), score: soulmate.compatibilityScore },
                  { label: t('sr_element_balance', '오행 밸런스'), score: Math.max(80, soulmate.compatibilityScore - 5) },
                ].map(item => (
                  <div key={item.label} className="p-2 text-center" style={{ border: '1px solid rgba(201,169,110,0.1)', background: 'rgba(201,169,110,0.02)' }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', color: '#c9a96e', lineHeight: 1 }}>{item.score}</p>
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px', color: '#8a7255', marginTop: 3 }}>{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="absolute bottom-3 right-4 opacity-[0.06]">
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '52px', color: '#c9a96e', lineHeight: 1 }}>♥</span>
              </div>
            </div>
          </motion.div>

          {/* ── [9] 서울 동네 ──────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionTitle title="Lucky Spot in Seoul" titleKr={t('sr_lucky_spot_seoul', '운명의 서울 동네')} emoji="📍" />
            <div style={{ border: '1px solid rgba(201,169,110,0.13)', overflow: 'hidden' }}>
              <div className="relative" style={{ height: 150 }}>
                <img src={BUKCHON_IMG} alt={neighborhood.name} className="w-full h-full object-cover"
                  style={{ opacity: 0.45, filter: 'saturate(0.6)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.92), transparent)' }} />
                <div className="absolute bottom-4 left-4">
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px', fontWeight: 400, color: '#f5f0e8', lineHeight: 1 }}>{neighborhood.name}</h3>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: '#e8dcca' }}>{neighborhood.nameKr}</p>
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1"
                  style={{ background: `${domLabel.color}18`, border: `1px solid ${domLabel.color}30` }}>
                  <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: domLabel.color }}>{domLabel.char} {domLabel.kr}</span>
                </div>
              </div>
              <div className="p-4">
                <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#d1c5b4', lineHeight: 1.8, marginBottom: 10 }}>{neighborhood.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {neighborhood.vibe.split(' · ').map((v: string) => (
                    <span key={v} style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#bba689', padding: '2px 8px', border: '1px solid rgba(201,169,110,0.12)' }}>{v}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── [9.5] 행운의 오행 처방 ────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionTitle title="Lucky Enhancers" titleKr={t('sr_lucky_enhancers', '행운을 부르는 오행 처방')} emoji="🍀" />
            <div className="p-4" style={{ border: '1px solid rgba(201,169,110,0.13)', background: 'rgba(255,255,255,0.01)' }}>
              <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#e8dcca', lineHeight: 1.8, marginBottom: 16 }}>
                {t('sr_you_need', '당신에게 가장 필요한')} <span style={{ color: elLabel.color }}>{elLabel.char}({elLabel.kr})</span> {t('sr_fill_energy', '기운을 일상 속에서 채우는 방법입니다.')}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Color', val: luckyData.color, icon: '🎨' },
                  { label: 'Item', val: luckyData.item, icon: '🛍️' },
                  { label: 'Place', val: luckyData.place, icon: '📍' },
                  { label: 'Action', val: luckyData.action, icon: '✨' },
                ].map(item => (
                  <div key={item.label} className="p-3" style={{ border: '1px solid rgba(201,169,110,0.08)', background: 'rgba(201,169,110,0.02)' }}>
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#bba689', letterSpacing: '0.1em', marginBottom: 6 }}>
                      <span style={{ marginRight: 4 }}>{item.icon}</span>{item.label}
                    </p>
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#c9a96e', lineHeight: 1.5 }}>
                      {item.val}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── [10] 이름 작명 원리 ─────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <SectionTitle title="Name Science" titleKr={t('sr_name_science', '성명학 · 이름 작명 원리')} emoji="📜" />
            <KoreanBorder>
              <div className="p-4" style={{ background: 'rgba(255,255,255,0.01)' }}>
                <div className="text-center mb-5">
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '52px', fontWeight: 400, color: '#f5f0e8', lineHeight: 1, letterSpacing: '0.06em' }}>{identity.fullName}</p>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '14px', fontStyle: 'italic', color: '#e8dcca', marginTop: 4 }}>{identity.fullNameRomanized}</p>
                </div>
                <div style={{ height: 1, background: 'rgba(201,169,110,0.1)', marginBottom: 14 }} />
                <div className="mb-4 p-3" style={{ border: `1px solid ${elLabel.color}18`, background: `${elLabel.color}05` }}>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: elLabel.color, letterSpacing: '0.15em', marginBottom: 8 }}>{t('sr_yongsin', '용신')}({elLabel.char} {elLabel.kr}) · {t('sr_name_energy', '이름의 기운')}</p>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#e8dcca', lineHeight: 1.85 }}>{identity.nameMeaning}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { num: '一', title: t('sr_element_complement', '오행 보완'), desc: `${t('sr_saju_lacking', '사주에 부족한')} ${elLabel.char}(${elLabel.kr}) ${t('sr_supplement_pronunciation', '기운을 발음 오행으로 보충')}` },
                    { num: '二', title: t('sr_name_strokes', '성명학 획수'), desc: t('sr_stroke_lucky', '성과 이름의 획수 조합이 대길(大吉) 수리 패턴에 부합') },
                    { num: '三', title: t('sr_yin_yang', '음양 배치'), desc: t('sr_yin_yang_balance', '음(陰)과 양(陽)이 조화롭게 배치되어 균형 잡힌 에너지 생성') },
                  ].map(item => (
                    <div key={item.num} className="flex items-start gap-3 p-3"
                      style={{ border: '1px solid rgba(201,169,110,0.15)', background: 'rgba(201,169,110,0.03)' }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: 'rgba(201,169,110,0.8)', lineHeight: 1 }}>{item.num}</span>
                      <div>
                        <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: '#c9a96e', marginBottom: 2 }}>{item.title}</p>
                        <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#d1c5b4', lineHeight: 1.7 }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </KoreanBorder>
          </motion.div>

          {/* ── CTA / Back to Home ──────────────────────────────────────── */}
          <motion.div className="text-center pt-8 mb-8"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#c9a96e', marginBottom: 16, lineHeight: 1.6 }}>
              {t('sr_ask_identity', '이름과 사주를 알아보겠습니까?')}
            </p>
            <button onClick={() => navigate('/')} style={{
              display: 'inline-block',
              padding: '16px 32px', cursor: 'pointer',
              fontFamily: 'Pretendard, sans-serif',
              fontSize: '14px', letterSpacing: '0.1em',
              color: '#0a0a0a', fontWeight: 500,
              background: 'linear-gradient(135deg, #c9a96e, #a07840)',
              border: 'none', borderRadius: '30px',
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(201,169,110,0.2)'
            }}>
              {t('sr_discover_identity', '나의 정체성 알아보기 🇰🇷')}
            </button>
          </motion.div>

          {/* ── Footer ──────────────────────────────────────── */}
          <motion.div className="text-center pt-4"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="flex justify-center mb-6" style={{ height: 2 }}>
              {['#C8102E', '#fbbf24', '#4ade80', '#60a5fa', '#C8102E'].map((c, i) => (
                <div key={i} style={{ flex: 1, background: c, maxWidth: 60 }} />
              ))}
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1" style={{ background: 'rgba(201,169,110,0.1)' }} />
              <div className="flex items-center gap-2">
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', color: '#c9a96e', letterSpacing: '0.14em' }}>K·REBORN</span>
                <span style={{ fontSize: '12px' }}>🇰🇷</span>
              </div>
              <div className="h-px flex-1" style={{ background: 'rgba(201,169,110,0.1)' }} />
            </div>
            <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#2e2820', marginBottom: 2 }}>
              {userInput.nationality} → {t('sr_analysis_desc', '대한민국 · 518,400 사주 패턴 분석')}
            </p>
            <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#2a2018' }}>Powered by NodeAnd ⋅ Seoul, Korea</p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
