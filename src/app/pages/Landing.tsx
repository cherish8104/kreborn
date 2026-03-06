import { useNavigate } from 'react-router';
import { motion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef } from 'react';
import { SEO } from '../components/SEO';

const SEOUL_BG = 'https://images.unsplash.com/photo-1579085353237-916e72ecb32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZW91bCUyMGNpdHklMjBkYXduJTIwbWlzdHklMjBza3lsaW5lJTIwY2luZW1hdGljfGVufDF8fHx8MTc3Mjc0MTQ0OHww&ixlib=rb-4.1.0&q=80&w=1080';
const WOMAN_IMG = 'https://images.unsplash.com/photo-1535189005916-e5e47dc88316?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLb3JlYW4lMjB3b21hbiUyMGVsZWdhbnQlMjBwb3J0cmFpdCUyMG1vZGVybiUyMFNlb3VsfGVufDF8fHx8MTc3Mjc0Mjg3Nnww&ixlib=rb-4.1.0&q=80&w=1080';
const MAN_IMG = 'https://images.unsplash.com/photo-1734669578509-97882e21f3a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLb3JlYW4lMjBtYW4lMjBzb3BoaXN0aWNhdGVkJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyNzQyODc3fDA&ixlib=rb-4.1.0&q=80&w=1080';
const STREET_IMG = 'https://images.unsplash.com/photo-1766650576968-7b9540286e2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZW91bCUyMEhvbmdkYWUlMjBzdHJlZXQlMjBuaWdodCUyMHZpYnJhbnQlMjBjdWx0dXJlfGVufDF8fHx8MTc3Mjc0Mjg3N3ww&ixlib=rb-4.1.0&q=80&w=1080';

function FadeIn({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

function SectionDivider() {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.3))' }} />
      <span style={{ color: '#c9a96e', fontSize: '7px' }}>◆</span>
      <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.3))' }} />
    </div>
  );
}

function SectionLabel({ en, kr }: { en: string; kr: string }) {
  return (
    <div className="text-center mb-5">
      <p style={{
        fontFamily: 'Pretendard, sans-serif', fontSize: '9px',
        color: '#5a4e44', letterSpacing: '0.28em', marginBottom: 6
      }}>{kr}</p>
      <SectionDivider />
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: '28px',
        fontWeight: 300, color: '#f5f0e8', letterSpacing: '0.06em', lineHeight: 1.2
      }}>{en}</h2>
    </div>
  );
}

/* ─── Data ─────────────────────────────────────────────── */
const REVEAL_ITEMS = [
  {
    icon: '名', iconLabel: '이름', color: '#c9a96e',
    title: '한국 이름', titleEn: 'Your Korean Name',
    desc: '사주의 부족한 기운(용신)을 채우는 발음 오행 + 획수 성명학으로 도출한 실제 대길(大吉) 조합.',
    sample: '이도윤 · Do-yun Lee', sampleSub: '"빛을 인도하는 자"'
  },
  {
    icon: '業', iconLabel: '직업', color: '#60a5fa',
    title: '직업 성향', titleEn: 'Career Archetype',
    desc: '일간(日干)의 오행 특성을 현대 한국 직업군과 매칭. 당신이 한국에 살았다면 어떤 커리어로 성공했을까?',
    sample: 'Creative Director', sampleSub: '크리에이티브 디렉터'
  },
  {
    icon: '緣', iconLabel: '운명', color: '#f472b6',
    title: '운명의 짝', titleEn: 'The Soulmate',
    desc: '사주 궁합으로 도출된 평행우주 속 한국인 인연. 이름·성격·궁합 점수 완전 공개.',
    sample: '박수현 · Su-hyeon Park', sampleSub: '궁합 91점 · 壬수 에너지'
  },
  {
    icon: '地', iconLabel: '동네', color: '#4ade80',
    title: '서울 동네', titleEn: 'Lucky Spot in Seoul',
    desc: '당신의 오행 에너지가 가장 빛나는 서울의 ZIP 코드. 하루 시나리오 스크립트와 함께.',
    sample: 'Hannam-dong · 한남동', sampleSub: 'Refined · Exclusive · Quiet Luxury'
  },
];

const FULL_SCRIPT_ITEMS = [
  { icon: '名', color: '#c9a96e', title: '한국 이름 + 의미 해설', free: true, desc: '성명학 대길 조합, 한자 의미 완전 해설' },
  { icon: '業', color: '#60a5fa', title: '직업 성향 리포트', free: true, desc: '일간 특성 × 현대 한국 직업군 매칭' },
  { icon: '☯', color: '#fbbf24', title: '일주론 · 일간 심층 분석', free: false, desc: '강점·주의·행운색·행운 숫자 분석' },
  { icon: '🐉', color: '#fb923c', title: '띠 · 십이지신 분석', free: false, desc: '12지신 기질 + 한국식 띠 궁합' },
  { icon: '緣', color: '#f472b6', title: '운명의 짝 프로필', free: false, desc: '이름·성격·궁합 점수 전체 공개' },
  { icon: '地', color: '#4ade80', title: '서울 동네 + 하루 시나리오', free: false, desc: '서울에서의 평행 하루를 시나리오로' },
  { icon: '圖', color: '#e2e8f0', title: '오행 레이더 차트', free: false, desc: '木火土금수 밸런스 시각화' },
  { icon: '📜', color: '#c9a96e', title: '성명학 작명 원리 해설', free: false, desc: '이름이 사주를 보완하는 과학적 원리' },
  { icon: '🪪', color: '#f5f0e8', title: 'HD ID 카드 무워터마크', free: false, desc: '다운로드 가능한 프리미엄 카드' },
];

const STEPS = [
  {
    num: '01', kr: '입력', title: 'The Registry',
    desc: '영문 이름, 생년월일시, 성별, 국적 입력. 실시간으로 사주 8글자가 생성됩니다.', detail: '약 1분 소요'
  },
  {
    num: '02', kr: '분석', title: 'The Montage',
    desc: '518,400개 사주 패턴 DB와 오행 알고리즘이 당신의 운명 좌표를 서울에 찍습니다.', detail: '3–5초 처리'
  },
  {
    num: '03', kr: '공개', title: 'The Reveal',
    desc: '이름·직업은 무료. 운명의 짝, 일주론, 서울 동네, 프리미엄 ID 카드는 ₩5,900에 해금.', detail: '무료 + ₩5,900'
  },
];

const TESTIMONIALS = [
  {
    name: 'Sophie L.', from: '🇫🇷 Paris', avatar: WOMAN_IMG,
    quote: '"이지원이라는 이름이 너무 잘 맞아. 의미를 찾아보고 조금 울었어."',
    result: '이지원 · Ji-won Lee · Designer'
  },
  {
    name: 'Marcus T.', from: '🇺🇸 New York', avatar: MAN_IMG,
    quote: '"My Korean name is 강민준. I typed it into Naver — it looked completely real. Career match is uncanny."',
    result: '강민준 · Min-jun Kang · Developer'
  },
  {
    name: 'Yuki M.', from: '🇯🇵 Tokyo', avatar: WOMAN_IMG,
    quote: '"K-드라마에서 보던 그런 이름이 내 이름이 됐어. 일주론 분석이 소름이었어."',
    result: '박서아 · Seo-a Park · Art Director'
  },
];

const ELEMENTS_DETAIL = [
  { char: '木', kr: '목·Wood', color: '#4ade80', title: '성장과 창조', desc: '甲木 리더 / 乙木 예술가' },
  { char: '火', kr: '화·Fire', color: '#fb923c', title: '열정과 카리스마', desc: '丙火 퍼포머 / 丁火 디자이너' },
  { char: '土', kr: '토·Earth', color: '#fbbf24', title: '안정과 신뢰', desc: '戊土 건축가 / 己土 교육자' },
  { char: '金', kr: '금·Metal', color: '#e2e8f0', title: '정밀함과 원칙', desc: '庚金 법조인 / 辛金 의사' },
  { char: '水', kr: '수·Water', color: '#60a5fa', title: '지성과 철학', desc: '壬水 개발자 / 癸수 연구자' },
];

const STATS = [
  { num: '518,400', label: '사주 패턴 DB' },
  { num: '10', label: '일간 유형' },
  { num: '5', label: '오행 분석' },
  { num: '9+', label: '결과 콘텐츠' },
];

/* ─── Main Component ─────────────────────────────────────── */
export function Landing() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 500], [0, 60]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const particles: { x: number; y: number; vx: number; vy: number; alpha: number; size: number }[] = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25, vy: -Math.random() * 0.35 - 0.05,
        alpha: Math.random() * 0.5 + 0.1, size: Math.random() * 1.2 + 0.3,
      });
    }
    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,169,110,${p.alpha})`; ctx.fill();
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ backgroundColor: '#0a0a0a' }}>
      <SEO
        title="koreaname - Get Your Authentic Korean Name Based on Saju"
        description="Discover your Korean identity. Get an authentic Korean name, career archetypes, and soulmate destiny based on 518,400 Saju patterns."
        keywords="koreaname, Korean name generator, Saju analysis, authentic Korean name, ชื่อเกาหลี, ตั้งชื่อเกาหลี"
      />

      {/* ════════════════════ HERO ════════════════════════ */}
      <div ref={heroRef} className="relative w-full flex flex-col items-center justify-center"
        style={{ minHeight: '100svh', overflow: 'hidden' }}>

        <motion.div className="absolute inset-0 z-0" style={{ y: heroBgY }}>
          <img src={SEOUL_BG} alt="Seoul dawn" className="w-full object-cover"
            style={{
              height: '115%', top: '-7%', position: 'absolute',
              opacity: 0.28, filter: 'blur(1.5px) saturate(0.6)'
            }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, #0a0a0a 0%, rgba(10,10,10,0.4) 35%, rgba(10,10,10,0.75) 75%, #0a0a0a 100%)' }} />
        </motion.div>

        {/* 단청 color stripe — top */}
        <div className="absolute top-0 left-0 right-0 z-30" style={{ height: 3, display: 'flex' }}>
          {['#C8102E', '#003478', '#fbbf24', '#003478', '#C8102E'].map((c, i) => (
            <div key={i} style={{ flex: 1, background: c, opacity: 0.5 }} />
          ))}
        </div>

        {/* Taegeuk watermark */}
        <div className="absolute pointer-events-none z-10"
          style={{ top: '12%', right: '4%', opacity: 0.055 }}>
          <svg width="120" height="120" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="47" fill="none" stroke="#c9a96e" strokeWidth="0.7" />
            <path d="M50,3 A47,47,0,0,1,50,97 A23.5,23.5,0,0,0,50,50 A23.5,23.5,0,0,1,50,3Z" fill="#C8102E" />
            <path d="M50,3 A23.5,23.5,0,0,0,50,50 A23.5,23.5,0,0,1,50,97 A47,47,0,0,1,50,3Z" fill="#003478" />
            <circle cx="50" cy="26.5" r="11.5" fill="#003478" />
            <circle cx="50" cy="73.5" r="11.5" fill="#C8102E" />
          </svg>
        </div>

        {/* 창살 lattice — left */}
        <div className="absolute left-0 top-0 bottom-0 pointer-events-none z-10" style={{ width: 24, opacity: 0.04 }}>
          <svg width="24" height="100%" style={{ height: '100%' }}>
            {Array.from({ length: 50 }).map((_, i) => (
              <g key={i}>
                <line x1="0" y1={i * 24} x2="24" y2={i * 24} stroke="#c9a96e" strokeWidth="0.5" />
                <line x1="12" y1={i * 24} x2="12" y2={(i + 1) * 24} stroke="#c9a96e" strokeWidth="0.5" />
              </g>
            ))}
          </svg>
        </div>

        <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none w-full h-full" />

        <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" style={{ opacity: 0.045 }}>
          <line x1="0" y1="28%" x2="100%" y2="28%" stroke="#c9a96e" strokeWidth="0.5" />
          <line x1="0" y1="72%" x2="100%" y2="72%" stroke="#c9a96e" strokeWidth="0.5" />
        </svg>

        <motion.div className="relative z-20 flex flex-col items-center text-center w-full px-10"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}>

          {/* Korea badge */}
          <motion.div className="mb-4 flex items-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <span style={{ fontSize: '13px' }}>🇰🇷</span>
            <span style={{
              fontFamily: 'Pretendard, sans-serif', color: '#3a3028', fontSize: '8px',
              letterSpacing: '0.22em', textTransform: 'uppercase'
            }}>
              서울, 대한민국 · Seoul, Korea
            </span>
          </motion.div>

          {/* Subtitle badge */}
          <motion.div className="mb-7 flex items-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="h-px w-8" style={{ background: 'linear-gradient(to right, transparent, #c9a96e)' }} />
            <span style={{
              fontFamily: 'Pretendard, sans-serif', color: '#c9a96e', fontSize: '9px',
              letterSpacing: '0.22em', textTransform: 'uppercase'
            }}>
              평행우주 속 나의 한국 정체성
            </span>
            <div className="h-px w-8" style={{ background: 'linear-gradient(to left, transparent, #c9a96e)' }} />
          </motion.div>

          {/* Logo */}
          <motion.h1 className="mb-2"
            style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(42px, 13vw, 58px)',
              fontWeight: 300, color: '#f5f0e8', letterSpacing: '0.1em', lineHeight: 1,
              whiteSpace: 'nowrap'
            }}
            initial={{ opacity: 0, letterSpacing: '0.22em' }}
            animate={{ opacity: 1, letterSpacing: '0.1em' }}
            transition={{ duration: 1.4, delay: 0.15 }}>
            K·REBORN
          </motion.h1>

          <motion.div className="mb-7 flex items-center gap-3 w-full"
            initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.7 }}>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, #c9a96e35)' }} />
            <span style={{ color: '#c9a96e', fontSize: '9px', letterSpacing: '0.28em', fontFamily: 'Pretendard, sans-serif' }}>
              사주 · 팔자 · 운명
            </span>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, #c9a96e35)' }} />
          </motion.div>

          <motion.p className="mb-3 px-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: '22px',
              fontWeight: 300, fontStyle: 'italic', color: '#c9a96e', lineHeight: 1.4
            }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
            "In another universe,<br />you were born in Korea."
          </motion.p>

          <motion.p className="mb-9 px-4"
            style={{
              fontFamily: 'Pretendard, sans-serif', fontSize: '13px',
              color: '#a39585', lineHeight: 1.85
            }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            사주 팔자(8글자) 분석으로 당신의<br />한국 이름, 직업 성향, 운명의 짝,<br />서울 동네를 처방합니다.
          </motion.p>

          <motion.button onClick={() => navigate('/registry')}
            className="w-full mb-10 relative overflow-hidden"
            style={{
              fontFamily: 'Pretendard, sans-serif', fontSize: '12px',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '17px 0', color: '#f5f0e8',
              border: '1px solid rgba(201,169,110,0.6)',
              background: 'transparent', cursor: 'pointer', outline: 'none'
            }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
            whileTap={{ scale: 0.97 }}>
            <motion.span className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.18), rgba(201,169,110,0.06))' }}
              initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.25 }} />
            <span className="relative">Begin My Reborn Journey →</span>
          </motion.button>

          {/* Five elements */}
          <motion.div className="flex items-center justify-center gap-5 mb-9"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            {[
              { char: '木', kr: '목', color: '#4ade80' }, { char: '火', kr: '화', color: '#fb923c' },
              { char: '土', kr: '토', color: '#fbbf24' }, { char: '金', kr: '금', color: '#e2e8f0' },
              { char: '水', kr: '수', color: '#60a5fa' },
            ].map((el, i) => (
              <motion.div key={el.char} className="flex flex-col items-center gap-1"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: '20px',
                  fontWeight: 500, color: el.color, lineHeight: 1
                }}>{el.char}</span>
                <span style={{
                  fontFamily: 'Pretendard, sans-serif', fontSize: '8px',
                  color: '#6b5d51', letterSpacing: '0.08em'
                }}>{el.kr}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="flex items-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#c9a96e', opacity: 0.6 }} />
            <p style={{
              fontFamily: 'Pretendard, sans-serif', fontSize: '10px',
              color: '#5a4e44', letterSpacing: '0.08em'
            }}>
              Data-driven by <span style={{ color: '#8a7255' }}>518,400</span> Saju Patterns
            </p>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#c9a96e', opacity: 0.6 }} />
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div className="absolute bottom-6 left-1/2 z-20 flex flex-col items-center gap-1.5"
          style={{ transform: 'translateX(-50%)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>
          <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#2a2018', letterSpacing: '0.18em' }}>SCROLL</span>
          <motion.div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(201,169,110,0.5), transparent)' }}
            animate={{ scaleY: [0, 1, 0], originY: 0 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />
        </motion.div>
      </div>


      {/* ═══ SECTION 1 — 차별점 ═══════════════════════════ */}
      <section className="px-5 py-16" style={{ borderTop: '1px solid rgba(201,169,110,0.07)' }}>
        <FadeIn>
          <div className="text-center mb-8">
            <p style={{
              fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#5a4e44',
              letterSpacing: '0.28em', marginBottom: 6
            }}>THE DIFFERENCE</p>
            <SectionDivider />
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: '30px',
              fontWeight: 300, color: '#f5f0e8', lineHeight: 1.25, marginBottom: 8
            }}>
              단순한 이름 짓기가<br />
              <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>아니다.</span>
            </h2>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="mb-2 p-5" style={{
            border: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(255,255,255,0.015)'
          }}>
            <p style={{
              fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#3a3028',
              letterSpacing: '0.15em', marginBottom: 12
            }}>일반 이름 생성기</p>
            {['발음 기반 단순 변환', '획수·오행 고려 없음', '직업/운명 분석 불가', '일회성 결과물'].map(t => (
              <div key={t} className="flex items-center gap-2 mb-2.5">
                <span style={{ color: '#2e2820', fontSize: '11px' }}>✕</span>
                <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#2e2820' }}>{t}</span>
              </div>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.18}>
          <div className="relative overflow-hidden p-5"
            style={{
              border: '1px solid rgba(201,169,110,0.35)',
              background: 'linear-gradient(145deg, rgba(201,169,110,0.07), rgba(201,169,110,0.02))'
            }}>
            <div className="absolute top-0 right-0 w-14 h-14"
              style={{ background: 'radial-gradient(circle at top right, rgba(201,169,110,0.15), transparent)' }} />
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontSize: '11px' }}>🇰🇷</span>
              <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#c9a96e', letterSpacing: '0.15em' }}>K·REBORN</p>
            </div>
            {['만세력 간지 8자 정확 계산', '오행·발음·획수 삼중 필터', '직업·일주론·궁합 AI 매칭', '프리미엄 ID 카드 발급', '518,400 사주 패턴 DB'].map(t => (
              <div key={t} className="flex items-center gap-2 mb-2.5">
                <span style={{ color: '#c9a96e', fontSize: '11px' }}>✦</span>
                <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#8a7255' }}>{t}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>


      {/* ═══ SECTION 2 — 4가지 처방 ═══════════════════════ */}
      <section className="px-5 py-16" style={{ borderTop: '1px solid rgba(201,169,110,0.07)' }}>
        <FadeIn>
          <SectionLabel en="4 Revelations" kr="네 가지 운명 처방" />
        </FadeIn>
        <div className="flex flex-col gap-4">
          {REVEAL_ITEMS.map((item, i) => (
            <FadeIn key={item.icon} delay={i * 0.08}>
              <div className="p-5 relative overflow-hidden"
                style={{
                  border: `1px solid ${item.color}20`,
                  background: `linear-gradient(145deg, ${item.color}07, transparent)`
                }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="shrink-0 w-11 h-11 flex flex-col items-center justify-center"
                    style={{ border: `1px solid ${item.color}28`, background: `${item.color}08` }}>
                    <span style={{
                      fontFamily: "'Cormorant Garamond', serif", fontSize: '20px',
                      color: item.color, lineHeight: 1
                    }}>{item.icon}</span>
                    <span style={{
                      fontFamily: 'Pretendard, sans-serif', fontSize: '6px',
                      color: item.color, opacity: 0.7, marginTop: 1
                    }}>{item.iconLabel}</span>
                  </div>
                  <div>
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif", fontSize: '18px',
                      fontWeight: 300, color: '#f5f0e8', lineHeight: 1.2
                    }}>{item.title}</p>
                    <p style={{
                      fontFamily: 'Pretendard, sans-serif', fontSize: '9px',
                      color: item.color, opacity: 0.8, marginTop: 1
                    }}>{item.titleEn}</p>
                  </div>
                </div>
                <p style={{
                  fontFamily: 'Pretendard, sans-serif', fontSize: '12px',
                  color: '#5a4e44', lineHeight: 1.8, marginBottom: 10
                }}>{item.desc}</p>
                <div className="pt-3" style={{ borderTop: `1px solid ${item.color}15` }}>
                  <p style={{
                    fontFamily: 'Pretendard, sans-serif', fontSize: '7px',
                    color: '#3a3028', letterSpacing: '0.12em', marginBottom: 3
                  }}>SAMPLE RESULT</p>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: '15px',
                    color: item.color
                  }}>{item.sample}</p>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#3a3028', marginTop: 1 }}>{item.sampleSub}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>


      {/* ═══ SECTION 3 — 포함 내용 ═════════════════════════ */}
      <section className="px-5 py-16 relative overflow-hidden"
        style={{ borderTop: '1px solid rgba(201,169,110,0.07)' }}>
        <div className="absolute inset-0 z-0">
          <img src={STREET_IMG} alt="Seoul street" className="w-full h-full object-cover"
            style={{ opacity: 0.06, filter: 'saturate(0.4)' }} />
          <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.93)' }} />
        </div>
        <div className="relative z-10">
          <FadeIn>
            <SectionLabel en="What You'll Receive" kr="이런 결과물을 받습니다" />
          </FadeIn>

          {/* Sample ID card mini */}
          <FadeIn delay={0.1}>
            <div className="relative overflow-hidden mb-6"
              style={{
                background: 'linear-gradient(145deg, #161410, #0e0c0a)',
                border: '1px solid rgba(201,169,110,0.38)', padding: '20px 16px'
              }}>
              {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r',
                'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map(c => (
                  <div key={c} className={`absolute w-3.5 h-3.5 ${c}`}
                    style={{ borderColor: 'rgba(201,169,110,0.65)' }} />
                ))}
              <div className="flex justify-between items-center mb-3">
                <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px', color: '#5a4e44', letterSpacing: '0.18em' }}>
                  K-REBORN · IDENTITY
                </span>
                <div className="flex items-center gap-1">
                  <span style={{ fontSize: '9px' }}>🇰🇷</span>
                  <span style={{
                    fontFamily: 'Pretendard, sans-serif', fontSize: '7px', color: '#c9a96e',
                    padding: '1px 5px', border: '1px solid rgba(201,169,110,0.28)'
                  }}>SAMPLE</span>
                </div>
              </div>
              <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #c9a96e22, transparent)', marginBottom: 14 }} />
              <div className="text-center mb-3">
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: '46px', fontWeight: 400,
                  color: '#f5f0e8', lineHeight: 1, letterSpacing: '0.04em'
                }}>이도윤</p>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: '13px',
                  fontStyle: 'italic', color: '#8a7255', marginTop: 3
                }}>Do-yun Lee</p>
              </div>
              <div className="flex justify-center gap-2 mb-3">
                {[['時', '壬', '子'], ['日', '甲', '辰'], ['月', '庚', '申'], ['年', '丙', '午']].map(([l, s, b]) => (
                  <div key={l} className="flex flex-col items-center px-1.5 py-1.5"
                    style={{ border: '1px solid rgba(201,169,110,0.1)', background: 'rgba(201,169,110,0.02)' }}>
                    <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '6px', color: '#2a2018', marginBottom: 2 }}>{l}</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', color: '#60a5fa', lineHeight: 1 }}>{s}</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', color: '#fb923c', lineHeight: 1, marginTop: 2 }}>{b}</span>
                  </div>
                ))}
              </div>
              {/* Lock overlay bottom half */}
              <div className="absolute bottom-0 left-0 right-0 h-14 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(to top, rgba(10,10,10,0.95) 60%, transparent)',
                  backdropFilter: 'blur(2px)'
                }}>
                <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#5a4e44', letterSpacing: '0.12em' }}>
                  ─ 당신의 카드를 잠금 해제하세요 ─
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Full script items */}
          <FadeIn delay={0.18}>
            <p style={{
              fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#5a4e44',
              letterSpacing: '0.18em', marginBottom: 12
            }}>FULL SCRIPT INCLUDES</p>
            {FULL_SCRIPT_ITEMS.map(item => (
              <div key={String(item.icon)} className="flex items-center gap-3 mb-3.5">
                <div className="w-8 h-8 shrink-0 flex items-center justify-center"
                  style={{ border: `1px solid ${item.color}28`, background: `${item.color}07` }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: '13px',
                    color: item.color
                  }}>{item.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#a39585' }}>{item.title}</p>
                    {item.free
                      ? <span style={{
                        fontFamily: 'Pretendard, sans-serif', fontSize: '7px', color: '#4ade80',
                        padding: '1px 5px', border: '1px solid #4ade8028'
                      }}>FREE</span>
                      : <span style={{
                        fontFamily: 'Pretendard, sans-serif', fontSize: '7px', color: '#c9a96e',
                        padding: '1px 5px', border: '1px solid rgba(201,169,110,0.28)'
                      }}>₩5,900</span>
                    }
                  </div>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: '#3a3028', marginTop: 1 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </FadeIn>
        </div>
      </section>


      {/* ═══ SECTION 4 — 사주 과학 ═════════════════════════ */}
      <section className="px-5 py-16" style={{ borderTop: '1px solid rgba(201,169,110,0.07)' }}>
        <FadeIn>
          <SectionLabel en="The Science" kr="사주 과학의 원리" />
          <p style={{
            fontFamily: 'Pretendard, sans-serif', fontSize: '13px', color: '#6b5d51',
            lineHeight: 1.85, textAlign: 'center', marginBottom: 14
          }}>
            미신이 아닙니다. 태어난 순간의 천문학적 좌표를<br />간지(干支)로 변환하고 오행 밸런스를 계산하는<br />
            <strong style={{ color: '#8a7255' }}>데이터 과학</strong>입니다.
          </p>
        </FadeIn>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {ELEMENTS_DETAIL.slice(0, 2).map((el, i) => (
            <FadeIn key={el.char} delay={i * 0.07}>
              <div className="p-4 text-center"
                style={{
                  border: `1px solid ${el.color}18`,
                  background: `linear-gradient(180deg, ${el.color}05 0%, transparent 100%)`
                }}>
                <motion.span style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: '34px',
                  color: el.color, lineHeight: 1, display: 'block', marginBottom: 3
                }}
                  animate={{ y: [0, -3, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}>
                  {el.char}
                </motion.span>
                <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px', color: el.color, opacity: 0.8, marginBottom: 5 }}>{el.kr}</p>
                <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: '#8a7255', marginBottom: 2 }}>{el.title}</p>
                <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#3a3028' }}>{el.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {ELEMENTS_DETAIL.slice(2).map((el, i) => (
            <FadeIn key={el.char} delay={(i + 2) * 0.07}>
              <div className="p-3 text-center"
                style={{
                  border: `1px solid ${el.color}18`,
                  background: `linear-gradient(180deg, ${el.color}05 0%, transparent 100%)`
                }}>
                <motion.span style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: '30px',
                  color: el.color, lineHeight: 1, display: 'block', marginBottom: 2
                }}
                  animate={{ y: [0, -3, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: (i + 2) * 0.5, ease: 'easeInOut' }}>
                  {el.char}
                </motion.span>
                <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '6px', color: el.color, opacity: 0.8, marginBottom: 4 }}>{el.kr}</p>
                <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#8a7255', marginBottom: 1 }}>{el.title}</p>
                <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#3a3028' }}>{el.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={0.2}>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map(s => (
              <div key={s.num} className="text-center p-4"
                style={{ border: '1px solid rgba(201,169,110,0.1)', background: 'rgba(201,169,110,0.02)' }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: '30px',
                  fontWeight: 300, color: '#c9a96e', lineHeight: 1
                }}>{s.num}</p>
                <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: '#8a7255', marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>


      {/* ═══ SECTION 5 — HOW IT WORKS ══════════════════════ */}
      <section className="px-5 py-16" style={{ borderTop: '1px solid rgba(201,169,110,0.07)' }}>
        <FadeIn><SectionLabel en="How It Works" kr="3단계 프로세스" /></FadeIn>
        <div className="flex flex-col gap-6">
          {STEPS.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.1}>
              <div className="flex gap-4">
                <div className="shrink-0 w-11 h-11 flex flex-col items-center justify-center"
                  style={{ border: '1px solid rgba(201,169,110,0.35)', background: '#0a0a0a' }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: '16px',
                    color: '#c9a96e', lineHeight: 1
                  }}>{step.num}</span>
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <p style={{
                      fontFamily: "'Cormorant Garamond', serif", fontSize: '19px',
                      fontWeight: 300, color: '#f5f0e8'
                    }}>{step.title}</p>
                    <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#5a4e44' }}>{step.kr}</span>
                  </div>
                  <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#6b5d51', lineHeight: 1.8, marginBottom: 6 }}>
                    {step.desc}
                  </p>
                  <span style={{
                    fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#c9a96e',
                    padding: '2px 8px', border: '1px solid rgba(201,169,110,0.28)',
                    background: 'rgba(201,169,110,0.05)'
                  }}>{step.detail}</span>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="ml-5 mt-2 h-5 w-px"
                  style={{ background: 'linear-gradient(to bottom, rgba(201,169,110,0.2), transparent)' }} />
              )}
            </FadeIn>
          ))}
        </div>
      </section>


      {/* ═══ SECTION 6 — 후기 ══════════════════════════════ */}
      <section className="px-5 py-16"
        style={{
          borderTop: '1px solid rgba(201,169,110,0.07)',
          background: 'linear-gradient(180deg, rgba(201,169,110,0.025) 0%, transparent 100%)'
        }}>
        <FadeIn>
          <SectionLabel en="Real Reactions" kr="글로벌 유저 후기" />
        </FadeIn>
        <div className="flex flex-col gap-4">
          {TESTIMONIALS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.08}>
              <div className="p-5 relative overflow-hidden"
                style={{ border: '1px solid rgba(201,169,110,0.1)', background: 'rgba(255,255,255,0.012)' }}>
                <span className="absolute top-3 right-4"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: '52px',
                    color: 'rgba(201,169,110,0.05)', lineHeight: 1
                  }}>"</span>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0"
                    style={{ border: '1px solid rgba(201,169,110,0.2)' }}>
                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover"
                      style={{ filter: 'grayscale(30%)' }} />
                  </div>
                  <div className="flex-1">
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '12px', color: '#a39585' }}>{t.name}</p>
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px', color: '#5a4e44' }}>{t.from}</p>
                  </div>
                  <div className="text-right">
                    <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px', color: '#2a2018', marginBottom: 1 }}>MY KOREAN NAME</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', color: '#c9a96e' }}>
                      {t.result.split(' · ')[0]}
                    </p>
                  </div>
                </div>
                <p style={{
                  fontFamily: 'Pretendard, sans-serif', fontSize: '12px',
                  color: '#6b5d51', lineHeight: 1.82, fontStyle: 'italic'
                }}>{t.quote}</p>
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(201,169,110,0.07)' }}>
                  <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#3a3028' }}>✦ {t.result}</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>


      {/* ═══ SECTION 7 — FINAL CTA ═════════════════════════ */}
      <section className="px-5 py-20 relative overflow-hidden"
        style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div style={{
            width: 350, height: 350,
            background: 'radial-gradient(circle, rgba(201,169,110,0.06) 0%, transparent 70%)'
          }} />
        </div>
        <div className="relative z-10 text-center">
          <FadeIn>
            <p style={{
              fontFamily: 'Pretendard, sans-serif', fontSize: '9px',
              color: '#5a4e44', letterSpacing: '0.25em', marginBottom: 10
            }}>지금 이 순간에도</p>
            <motion.h2
              style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: '32px',
                fontWeight: 300, color: '#f5f0e8', lineHeight: 1.25, marginBottom: 14
              }}
              animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 4, repeat: Infinity }}>
              당신의 한국 이름이<br />
              <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>기다리고 있습니다.</span>
            </motion.h2>
            <p style={{
              fontFamily: 'Pretendard, sans-serif', fontSize: '13px', color: '#6b5d51',
              lineHeight: 1.9, marginBottom: 18
            }}>
              평행우주의 당신은 이미 서울 어느 동네에서,<br />
              어떤 직업으로, 누군가를 사랑하며 살고 있습니다.
            </p>

            <div className="flex items-center gap-0 mb-8"
              style={{ border: '1px solid rgba(201,169,110,0.22)', background: 'rgba(201,169,110,0.04)' }}>
              <div className="flex-1 py-4 px-4 text-center">
                <p style={{
                  fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#5a4e44',
                  letterSpacing: '0.1em', marginBottom: 3
                }}>이름 + 직업 성향</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: '#4ade80' }}>무료 공개</p>
              </div>
              <div style={{ width: 1, alignSelf: 'stretch', background: 'rgba(201,169,110,0.18)' }} />
              <div className="flex-1 py-4 px-4 text-center">
                <p style={{
                  fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#5a4e44',
                  letterSpacing: '0.08em', marginBottom: 3
                }}>7가지 프리미엄 분석</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', color: '#c9a96e' }}>
                  ₩5,900 <span style={{ fontSize: '11px', color: '#5a4e44' }}>/ $4.5</span>
                </p>
              </div>
            </div>

            <motion.button onClick={() => navigate('/registry')} className="w-full mb-4"
              style={{
                padding: '18px 0', fontFamily: 'Pretendard, sans-serif', fontSize: '13px',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                background: 'linear-gradient(135deg, rgba(201,169,110,0.3), rgba(201,169,110,0.12))',
                border: '1px solid rgba(201,169,110,0.65)', color: '#f5f0e8', cursor: 'pointer'
              }}
              whileTap={{ scale: 0.97 }}>
              Begin My Reborn Journey →
            </motion.button>

            <div className="flex items-center justify-center gap-5 mb-12">
              {['🔒 보안 결제', '⚡ 즉시 결과', '🌏 전 세계'].map(t => (
                <p key={t} style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#3a3028' }}>{t}</p>
              ))}
            </div>

            {/* 단청 stripe footer */}
            <div className="flex justify-center mb-4" style={{ height: 2 }}>
              {['#C8102E', '#003478', '#fbbf24', '#003478', '#C8102E'].map((c, i) => (
                <div key={i} style={{ flex: 1, background: c, maxWidth: 50, opacity: 0.4 }} />
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-10" style={{ background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.25))' }} />
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: '10px' }}>🇰🇷</span>
                <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#2e2820' }}>
                  Seoul, Korea · Powered by NodeAnd
                </p>
              </div>
              <div className="h-px w-10" style={{ background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.25))' }} />
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}