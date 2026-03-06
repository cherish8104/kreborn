import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../store/UserContext';

const ELEMENTS = [
  { char: '木', kr: '목', color: '#4ade80', angle: 0,   r: 90 },
  { char: '火', kr: '화', color: '#fb923c', angle: 72,  r: 90 },
  { char: '土', kr: '토', color: '#fbbf24', angle: 144, r: 90 },
  { char: '金', kr: '금', color: '#e2e8f0', angle: 216, r: 90 },
  { char: '水', kr: '수', color: '#60a5fa', angle: 288, r: 90 },
];

const COPY_LINES = [
  'Parsing 518,400 Saju patterns…',
  'Syncing your energy with Seoul\'s coordinates…',
  'Calibrating Five Element resonance…',
  'Allocating your Korean identity…',
  'Crystallising your parallel life…',
];

export function Montage() {
  const navigate = useNavigate();
  const { identity } = useUser();
  const [copyIndex, setCopyIndex] = useState(0);
  const [converging, setConverging] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!identity) { navigate('/registry'); return; }
    const copyInterval = setInterval(() => {
      setCopyIndex(i => {
        if (i >= COPY_LINES.length - 2) { clearInterval(copyInterval); }
        return Math.min(i + 1, COPY_LINES.length - 1);
      });
    }, 900);
    const convergeTimer = setTimeout(() => setConverging(true), 3200);
    const doneTimer     = setTimeout(() => setDone(true), 4500);
    const navTimer      = setTimeout(() => navigate('/reveal'), 5000);
    return () => {
      clearInterval(copyInterval);
      clearTimeout(convergeTimer);
      clearTimeout(doneTimer);
      clearTimeout(navTimer);
    };
  }, [identity, navigate]);

  const toXY = (angle: number, r: number) => ({
    x: Math.cos((angle - 90) * Math.PI / 180) * r,
    y: Math.sin((angle - 90) * Math.PI / 180) * r,
  });

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center"
         style={{ backgroundColor: '#0a0a0a', overflow: 'hidden', position: 'relative' }}>

      {/* BG pulse */}
      <motion.div className="absolute rounded-full"
        style={{ width: 340, height: 340, top: '50%', left: '50%',
                 background: 'radial-gradient(circle, rgba(201,169,110,0.05) 0%, transparent 70%)',
                 transform: 'translate(-50%, -50%)' }}
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />

      {/* Logo */}
      <motion.div className="absolute top-8 left-1/2" style={{ transform: 'translateX(-50%)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 300,
                       color: '#c9a96e', letterSpacing: '0.18em' }}>K·REBORN</span>
      </motion.div>

      {/* Step indicator */}
      <motion.div className="absolute top-14 left-1/2" style={{ transform: 'translateX(-50%)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px',
                       color: '#3a3028', letterSpacing: '0.2em' }}>2 / 3</span>
      </motion.div>

      {/* Orbiting elements */}
      <div className="relative" style={{ width: 240, height: 240 }}>
        {ELEMENTS.map((el, i) => {
          const pos = toXY(el.angle, el.r);
          return (
            <motion.div key={el.char}
              className="absolute flex flex-col items-center justify-center"
              style={{ width: 48, height: 48, top: '50%', left: '50%',
                       marginTop: -24, marginLeft: -24,
                       border: `1px solid ${el.color}28`,
                       background: `${el.color}07` }}
              animate={converging
                ? { x: 0, y: 0, opacity: done ? 0 : 1, scale: done ? 1.8 : 1 }
                : { x: [pos.x, pos.x * 1.05, pos.x], y: [pos.y, pos.y * 0.95, pos.y], rotate: [0, 360] }
              }
              initial={{ x: pos.x, y: pos.y, opacity: 0 }}
              transition={converging
                ? { duration: 1.1, ease: 'easeInOut', opacity: { delay: 0.8 } }
                : { duration: 4 + i * 0.4, repeat: Infinity, ease: 'linear',
                    x: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                    y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 6 + i, repeat: Infinity, ease: 'linear' },
                    opacity: { duration: 0.5, delay: i * 0.1 } }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px',
                             fontWeight: 400, color: el.color, lineHeight: 1 }}>{el.char}</span>
              <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px',
                             color: el.color, opacity: 0.7, marginTop: 1 }}>{el.kr}</span>
            </motion.div>
          );
        })}

        {/* Center orb */}
        <motion.div className="absolute rounded-full flex items-center justify-center"
          style={{ width: 60, height: 60, top: '50%', left: '50%',
                   marginTop: -30, marginLeft: -30,
                   background: 'radial-gradient(circle, rgba(201,169,110,0.14) 0%, transparent 70%)',
                   border: '1px solid rgba(201,169,110,0.28)' }}
          animate={{ scale: [1, 1.14, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <AnimatePresence>
            {converging && (
              <motion.span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', color: '#c9a96e' }}
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                命
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Connecting lines */}
        {!converging && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.1 }}>
            {ELEMENTS.map((el, i) => {
              const p1 = toXY(el.angle, el.r);
              const p2 = toXY(ELEMENTS[(i + 1) % ELEMENTS.length].angle, ELEMENTS[(i + 1) % ELEMENTS.length].r);
              return (
                <line key={i} x1={120 + p1.x} y1={120 + p1.y} x2={120 + p2.x} y2={120 + p2.y}
                      stroke="#c9a96e" strokeWidth="0.5"/>
              );
            })}
          </svg>
        )}
      </div>

      {/* Copy text */}
      <div className="mt-12 text-center px-8 min-h-[52px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p key={copyIndex}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px',
                     fontStyle: 'italic', fontWeight: 300, color: '#a39585', letterSpacing: '0.02em' }}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.55 }}>
            {COPY_LINES[copyIndex]}
          </motion.p>
        </AnimatePresence>

        {/* Progress bar */}
        <motion.div className="mt-5 relative" style={{ width: 180, height: 1, background: 'rgba(201,169,110,0.08)' }}>
          <motion.div className="absolute inset-y-0 left-0"
            style={{ background: 'linear-gradient(to right, #c9a96e70, #c9a96e)' }}
            animate={{ width: ['0%', '100%'] }}
            transition={{ duration: 4.5, ease: 'easeInOut' }} />
        </motion.div>
      </div>

      {/* Korean subtitle */}
      <motion.p className="mt-5 px-8 text-center"
        style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px',
                 color: '#3a3028', letterSpacing: '0.12em' }}
        animate={{ opacity: [0.3, 0.75, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}>
        당신의 한국 정체성을 깨우는 중…
      </motion.p>
    </div>
  );
}
