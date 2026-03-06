/**
 * K-REBORN · ResultCard Template
 * Fixed identity card layout — data slots filled dynamically.
 * mode='preview' → premium sections blurred + locked
 * mode='full'    → all sections visible
 */
import { motion } from 'motion/react';
import type { KoreanIdentity, SajuData } from '../utils/sajuEngine';
import { ELEMENT_LABELS } from '../utils/sajuEngine';
import type { UserInput } from '../store/UserContext';

const EL_COLOR: Record<string, string> = {
  '木':'#4ade80','火':'#fb923c','土':'#fbbf24','金':'#e2e8f0','水':'#60a5fa',
};

/* ── Corner accent (reused 4×) ──────────────────────────────── */
function Corner({ pos }: { pos: string }) {
  return (
    <div className={`absolute w-4 h-4 ${pos}`}
         style={{ borderColor:'rgba(201,169,110,0.6)',
                  borderTopWidth:   pos.includes('top')    ? 1 : 0,
                  borderBottomWidth:pos.includes('bottom') ? 1 : 0,
                  borderLeftWidth:  pos.includes('left')   ? 1 : 0,
                  borderRightWidth: pos.includes('right')  ? 1 : 0,
                  borderStyle:'solid' }} />
  );
}

/* ── Locked slot wrapper ────────────────────────────────────── */
function LockedSlot({ children, locked, label }: {
  children: React.ReactNode; locked: boolean; label: string;
}) {
  return (
    <div className="relative overflow-hidden">
      <motion.div animate={{ filter: locked ? 'blur(3px)' : 'blur(0px)', opacity: locked ? 0.6 : 1 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}>
        {children}
      </motion.div>
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center"
             style={{ background: 'rgba(10,10,10,0.15)', backdropFilter: 'blur(1px)' }}>
          <div className="flex items-center gap-2 px-3 py-1.5"
               style={{ background: 'rgba(10,10,10,0.9)', border: '1px solid rgba(201,169,110,0.4)' }}>
            <span style={{ fontSize: '11px' }}>🔒</span>
            <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px',
                           color: '#c9a96e', letterSpacing: '0.1em' }}>{label}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Pillar box ─────────────────────────────────────────────── */
function PillarBox({ pillar, label }: {
  pillar: SajuData['year']; label: string;
}) {
  return (
    <div className="flex flex-col items-center px-2 py-2"
         style={{ border: '1px solid rgba(201,169,110,0.12)',
                  background: 'rgba(201,169,110,0.025)', minWidth: 44 }}>
      <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px',
                     color: '#2a2018', letterSpacing: '0.1em', marginBottom: 3 }}>{label}</span>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px',
                     color: EL_COLOR[pillar.stemEl] || '#f5f0e8', lineHeight: 1 }}>{pillar.stem}</span>
      <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '6px', color: '#3a3028', marginBottom: 3 }}>
        {pillar.stemEl}
      </span>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px',
                     color: EL_COLOR[pillar.branchEl] || '#f5f0e8', lineHeight: 1 }}>{pillar.branch}</span>
      <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '6px', color: '#3a3028' }}>
        {pillar.branchEl}
      </span>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────── */
interface ResultCardProps {
  identity: KoreanIdentity;
  userInput: UserInput;
  mode?: 'preview' | 'full';
  /** Extra bottom padding inside card (for payment sheet clearance) */
  extraPad?: number;
}

export function ResultCard({ identity, userInput, mode = 'full', extraPad = 0 }: ResultCardProps) {
  const locked = mode === 'preview';
  const { saju, soulmate, neighborhood } = identity;
  const elLabel  = ELEMENT_LABELS[saju.lackingElement];
  const domLabel = ELEMENT_LABELS[saju.dominantElement];

  return (
    <div className="relative overflow-hidden"
         style={{ background: 'linear-gradient(160deg, #141210, #0d0b09)',
                  border: '1px solid rgba(201,169,110,0.35)',
                  paddingBottom: extraPad }}>

      {/* Corner accents */}
      <Corner pos="top-0 left-0" />
      <Corner pos="top-0 right-0" />
      <Corner pos="bottom-0 left-0" />
      <Corner pos="bottom-0 right-0" />

      {/* ── HEADER ───────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4"
           style={{ borderBottom: '1px solid rgba(201,169,110,0.08)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px',
                        color: '#5a4e44', letterSpacing: '0.25em', marginBottom: 1 }}>
              K-REBORN · PARALLEL LIFE
            </p>
            <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px', color: '#2a2018' }}>
              IDENTITY CARD · 신원 확인서
            </p>
          </div>
          <div className="text-right">
            <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px',
                        color: '#3a3028', letterSpacing: '0.1em' }}>
              {userInput.nationality.toUpperCase()}
            </p>
            <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px', color: '#2a2018' }}>
              → 대한민국
            </p>
          </div>
        </div>
      </div>

      {/* ── NAME SLOT ────────────────────────────────────── */}
      <motion.div className="px-5 py-6 text-center"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}>

        <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px', color: '#3a3028',
                    letterSpacing: '0.18em', marginBottom: 8 }}>평행우주의 당신</p>

        <motion.h1
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '60px',
                   fontWeight: 400, color: '#f5f0e8', lineHeight: 1, letterSpacing: '0.04em' }}
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 90 }}>
          {identity.fullName}
        </motion.h1>

        <motion.p
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '15px',
                   fontStyle: 'italic', color: '#8a7255', marginTop: 4 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
          {identity.fullNameRomanized}
        </motion.p>

        {/* Element badge */}
        <motion.div className="flex justify-center mt-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px',
                         color: elLabel.color, background: `${elLabel.color}12`,
                         padding: '3px 10px', letterSpacing: '0.1em' }}>
            {elLabel.char} {elLabel.kr} · 이름의 기운
          </span>
        </motion.div>
      </motion.div>

      {/* ── SAJU PILLARS SLOT ────────────────────────────── */}
      <div className="px-5 pb-5">
        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.18), transparent)', marginBottom: 16 }}/>

        <motion.div className="flex justify-center gap-2.5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <PillarBox pillar={saju.hour}  label="時" />
          <PillarBox pillar={saju.day}   label="日" />
          <PillarBox pillar={saju.month} label="月" />
          <PillarBox pillar={saju.year}  label="年" />
        </motion.div>

        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.18), transparent)', marginTop: 16 }}/>
      </div>

      {/* ── CAREER + ELEMENT SLOT ────────────────────────── */}
      <motion.div className="px-5 pb-4 flex justify-between items-start"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        <div>
          <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px',
                      color: '#2a2018', letterSpacing: '0.15em', marginBottom: 3 }}>CAREER</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px',
                      fontWeight: 300, color: '#c9a96e', fontStyle: 'italic' }}>
            {identity.career}
          </p>
          <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px',
                      color: '#5a4e44', marginTop: 1 }}>{identity.careerKr}</p>
        </div>
        <div className="text-right">
          <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px',
                      color: '#2a2018', letterSpacing: '0.15em', marginBottom: 3 }}>DOMINANT</p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px',
                      color: domLabel.color, lineHeight: 1 }}>{domLabel.char}</p>
          <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px',
                      color: domLabel.color, opacity: 0.8 }}>{domLabel.kr}</p>
        </div>
      </motion.div>

      {/* ── NAME MEANING ─────────────────────────────────── */}
      <div className="px-5 pb-4"
           style={{ borderTop: '1px solid rgba(201,169,110,0.06)' }}>
        <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px',
                    color: '#5a4e44', lineHeight: 1.75, marginTop: 12 }}>
          {identity.nameMeaning}
        </p>
      </div>

      {/* ── PREMIUM DIVIDER ──────────────────────────────── */}
      <div className="px-5 py-2">
        <div className="flex items-center gap-2">
          <div className="h-px flex-1" style={{ background: 'rgba(201,169,110,0.12)' }}/>
          <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px',
                         color: locked ? '#3a3028' : '#c9a96e',
                         letterSpacing: '0.18em', transition: 'color 0.5s' }}>
            {locked ? '🔒 PREMIUM' : '✦ PREMIUM'}
          </span>
          <div className="h-px flex-1" style={{ background: 'rgba(201,169,110,0.12)' }}/>
        </div>
      </div>

      {/* ── SOULMATE SLOT ────────────────────────────────── */}
      <div className="px-5 pb-4">
        <LockedSlot locked={locked} label="결제 후 공개">
          <div className="p-4"
               style={{ border: '1px solid rgba(201,169,110,0.14)',
                        background: 'rgba(255,255,255,0.01)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px',
                             color: '#5a4e44', letterSpacing: '0.18em' }}>운명의 짝 · SOULMATE</span>
              <div className="h-px flex-1" style={{ background: 'rgba(201,169,110,0.1)' }}/>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '26px',
                             fontWeight: 400, color: '#f5f0e8', lineHeight: 1 }}>
                  {soulmate.name}
                </p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '12px',
                             fontStyle: 'italic', color: '#8a7255', marginTop: 1 }}>
                  {soulmate.nameRomanized}
                </p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {[soulmate.trait1, soulmate.trait2, soulmate.trait3].map(t => (
                    <span key={t} style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px',
                                           color: '#6b5d51', padding: '2px 7px',
                                           border: '1px solid rgba(201,169,110,0.15)' }}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="text-center shrink-0 ml-3">
                <div className="w-12 h-12 flex items-center justify-center"
                     style={{ border: '1px solid rgba(201,169,110,0.3)',
                              background: 'rgba(201,169,110,0.07)' }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px',
                                 color: '#c9a96e', fontWeight: 400 }}>
                    {soulmate.compatibilityScore}
                  </span>
                </div>
                <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px',
                             color: '#3a3028', marginTop: 3 }}>COMPAT.</p>
              </div>
            </div>
          </div>
        </LockedSlot>
      </div>

      {/* ── NEIGHBORHOOD SLOT ────────────────────────────── */}
      <div className="px-5 pb-5">
        <LockedSlot locked={locked} label="결제 후 공개">
          <div className="p-4"
               style={{ border: '1px solid rgba(201,169,110,0.14)',
                        background: 'rgba(255,255,255,0.01)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '8px',
                             color: '#5a4e44', letterSpacing: '0.18em' }}>
                운명의 동네 · LUCKY SPOT IN SEOUL
              </span>
              <div className="h-px flex-1" style={{ background: 'rgba(201,169,110,0.1)' }}/>
            </div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px',
                        fontWeight: 300, color: '#4ade80', lineHeight: 1 }}>
              {neighborhood.name}
            </p>
            <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '11px',
                        color: '#5a4e44', marginTop: 2 }}>{neighborhood.nameKr}</p>
            <p style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '10px',
                        color: '#3a3028', lineHeight: 1.7, marginTop: 6 }}>
              {neighborhood.vibe}
            </p>
          </div>
        </LockedSlot>
      </div>

      {/* ── FOOTER ───────────────────────────────────────── */}
      <div className="px-5 pb-5"
           style={{ borderTop: '1px solid rgba(201,169,110,0.08)' }}>
        <div className="flex items-center justify-between mt-4">
          <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px', color: '#1e1810' }}>
            K-REBORN © 2026
          </span>
          <span style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '7px', color: '#1e1810' }}>
            {userInput.nationality} → 대한민국
          </span>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
           style={{ opacity: 0.025 }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '88px',
                       fontWeight: 700, color: '#c9a96e', transform: 'rotate(-28deg)',
                       userSelect: 'none', whiteSpace: 'nowrap' }}>
          {mode === 'preview' ? 'PREVIEW' : 'K-REBORN'}
        </span>
      </div>
    </div>
  );
}