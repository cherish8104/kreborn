import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useUser } from '../store/UserContext';
import { calculateSaju, generateKoreanIdentity } from '../utils/sajuEngine';
import { trackCompleteRegistration } from '../../lib/analytics';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import type { Pillar } from '../utils/sajuEngine';

/* ─── Constants ─────────────────────────────────────────── */
const SEOUL_BG = 'https://images.unsplash.com/photo-1579085353237-916e72ecb32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTZW91bCUyMGNpdHklMjBkYXduJTIwbWlzdHklMjBza3lsaW5lJTIwY2luZW1hdGljfGVufDF8fHx8MTc3Mjc0MTQ0OHww&ixlib=rb-4.1.0&q=80&w=1080';

const EL_COLORS: Record<string, string> = {
  '木': '#4ade80', '火': '#fb923c', '土': '#fbbf24', '金': '#e2e8f0', '水': '#60a5fa',
};

const HOURS = [
  { value: 12, label: '모름', sub: 'Unknown / Default' },
  { value: 23, label: '자시 子時', sub: '23:00 – 01:00' },
  { value: 1, label: '축시 丑時', sub: '01:00 – 03:00' },
  { value: 3, label: '인시 寅時', sub: '03:00 – 05:00' },
  { value: 5, label: '묘시 卯時', sub: '05:00 – 07:00' },
  { value: 7, label: '진시 辰時', sub: '07:00 – 09:00' },
  { value: 9, label: '사시 巳時', sub: '09:00 – 11:00' },
  { value: 11, label: '오시 午時', sub: '11:00 – 13:00' },
  { value: 13, label: '미시 未時', sub: '13:00 – 15:00' },
  { value: 15, label: '신시 申時', sub: '15:00 – 17:00' },
  { value: 17, label: '유시 酉時', sub: '17:00 – 19:00' },
  { value: 19, label: '술시 戌時', sub: '19:00 – 21:00' },
  { value: 21, label: '해시 亥時', sub: '21:00 – 23:00' },
];

const NATIONALITIES: { flag: string; label: string; value: string }[] = [
  // North America
  { flag: '🇺🇸', label: 'American', value: 'American' },
  { flag: '🇨🇦', label: 'Canadian', value: 'Canadian' },
  { flag: '🇲🇽', label: 'Mexican', value: 'Mexican' },
  { flag: '🇨🇺', label: 'Cuban', value: 'Cuban' },
  { flag: '🇯🇲', label: 'Jamaican', value: 'Jamaican' },
  { flag: '🇵🇦', label: 'Panamanian', value: 'Panamanian' },
  // Europe
  { flag: '🇬🇧', label: 'British', value: 'British' },
  { flag: '🇫🇷', label: 'French', value: 'French' },
  { flag: '🇩🇪', label: 'German', value: 'German' },
  { flag: '🇮🇹', label: 'Italian', value: 'Italian' },
  { flag: '🇪🇸', label: 'Spanish', value: 'Spanish' },
  { flag: '🇳🇱', label: 'Dutch', value: 'Dutch' },
  { flag: '🇵🇹', label: 'Portuguese', value: 'Portuguese' },
  { flag: '🇨🇭', label: 'Swiss', value: 'Swiss' },
  { flag: '🇧🇪', label: 'Belgian', value: 'Belgian' },
  { flag: '🇦🇹', label: 'Austrian', value: 'Austrian' },
  { flag: '🇸🇪', label: 'Swedish', value: 'Swedish' },
  { flag: '🇳🇴', label: 'Norwegian', value: 'Norwegian' },
  { flag: '🇩🇰', label: 'Danish', value: 'Danish' },
  { flag: '🇫🇮', label: 'Finnish', value: 'Finnish' },
  { flag: '🇮🇪', label: 'Irish', value: 'Irish' },
  { flag: '🇵🇱', label: 'Polish', value: 'Polish' },
  { flag: '🇨🇿', label: 'Czech', value: 'Czech' },
  { flag: '🇭🇺', label: 'Hungarian', value: 'Hungarian' },
  { flag: '🇬🇷', label: 'Greek', value: 'Greek' },
  { flag: '🇷🇴', label: 'Romanian', value: 'Romanian' },
  { flag: '🇧🇬', label: 'Bulgarian', value: 'Bulgarian' },
  { flag: '🇷🇺', label: 'Russian', value: 'Russian' },
  { flag: '🇺🇦', label: 'Ukrainian', value: 'Ukrainian' },
  { flag: '🇹🇷', label: 'Turkish', value: 'Turkish' },
  { flag: '🇷🇸', label: 'Serbian', value: 'Serbian' },
  { flag: '🇭🇷', label: 'Croatian', value: 'Croatian' },
  // Asia
  { flag: '🇯🇵', label: 'Japanese', value: 'Japanese' },
  { flag: '🇨🇳', label: 'Chinese', value: 'Chinese' },
  { flag: '🇹🇼', label: 'Taiwanese', value: 'Taiwanese' },
  { flag: '🇭🇰', label: 'Hong Konger', value: 'Hong Konger' },
  { flag: '🇮🇳', label: 'Indian', value: 'Indian' },
  { flag: '🇵🇰', label: 'Pakistani', value: 'Pakistani' },
  { flag: '🇧🇩', label: 'Bangladeshi', value: 'Bangladeshi' },
  { flag: '🇱🇰', label: 'Sri Lankan', value: 'Sri Lankan' },
  { flag: '🇳🇵', label: 'Nepali', value: 'Nepali' },
  // Southeast Asia
  { flag: '🇹🇭', label: 'Thai', value: 'Thai' },
  { flag: '🇻🇳', label: 'Vietnamese', value: 'Vietnamese' },
  { flag: '🇮🇩', label: 'Indonesian', value: 'Indonesian' },
  { flag: '🇲🇾', label: 'Malaysian', value: 'Malaysian' },
  { flag: '🇸🇬', label: 'Singaporean', value: 'Singaporean' },
  { flag: '🇵🇭', label: 'Filipino', value: 'Filipino' },
  { flag: '🇲🇲', label: 'Burmese', value: 'Burmese' },
  { flag: '🇰🇭', label: 'Cambodian', value: 'Cambodian' },
  // Middle East & Central Asia
  { flag: '🇸🇦', label: 'Saudi Arabian', value: 'Saudi Arabian' },
  { flag: '🇦🇪', label: 'Emirati', value: 'Emirati' },
  { flag: '🇮🇷', label: 'Iranian', value: 'Iranian' },
  { flag: '🇮🇱', label: 'Israeli', value: 'Israeli' },
  { flag: '🇪🇬', label: 'Egyptian', value: 'Egyptian' },
  { flag: '🇰🇿', label: 'Kazakhstani', value: 'Kazakhstani' },
  { flag: '🇺🇿', label: 'Uzbekistani', value: 'Uzbekistani' },
  { flag: '🇶🇦', label: 'Qatari', value: 'Qatari' },
  { flag: '🇰🇼', label: 'Kuwaiti', value: 'Kuwaiti' },
  { flag: '🇯🇴', label: 'Jordanian', value: 'Jordanian' },
  // Africa
  { flag: '🇿🇦', label: 'South African', value: 'South African' },
  { flag: '🇳🇬', label: 'Nigerian', value: 'Nigerian' },
  { flag: '🇰🇪', label: 'Kenyan', value: 'Kenyan' },
  { flag: '🇲🇦', label: 'Moroccan', value: 'Moroccan' },
  { flag: '🇬🇭', label: 'Ghanaian', value: 'Ghanaian' },
  { flag: '🇪🇹', label: 'Ethiopian', value: 'Ethiopian' },
  { flag: '🇹🇿', label: 'Tanzanian', value: 'Tanzanian' },
  // Oceania
  { flag: '🇦🇺', label: 'Australian', value: 'Australian' },
  { flag: '🇳🇿', label: 'New Zealander', value: 'New Zealander' },
  { flag: '🇫🇯', label: 'Fijian', value: 'Fijian' },
  // South America
  { flag: '🇧🇷', label: 'Brazilian', value: 'Brazilian' },
  { flag: '🇦🇷', label: 'Argentine', value: 'Argentine' },
  { flag: '🇨🇴', label: 'Colombian', value: 'Colombian' },
  { flag: '🇨🇱', label: 'Chilean', value: 'Chilean' },
  { flag: '🇵🇪', label: 'Peruvian', value: 'Peruvian' },
  { flag: '🇻🇪', label: 'Venezuelan', value: 'Venezuelan' },
  { flag: '🇪🇨', label: 'Ecuadorian', value: 'Ecuadorian' },
  { flag: '🇺🇾', label: 'Uruguayan', value: 'Uruguayan' },
  // Other
  { flag: '🌏', label: 'Other', value: 'Other' },
];

const MONTHS = [
  { num: '01', kr: '1월', en: 'Jan' }, { num: '02', kr: '2월', en: 'Feb' },
  { num: '03', kr: '3월', en: 'Mar' }, { num: '04', kr: '4월', en: 'Apr' },
  { num: '05', kr: '5월', en: 'May' }, { num: '06', kr: '6월', en: 'Jun' },
  { num: '07', kr: '7월', en: 'Jul' }, { num: '08', kr: '8월', en: 'Aug' },
  { num: '09', kr: '9월', en: 'Sep' }, { num: '10', kr: '10월', en: 'Oct' },
  { num: '11', kr: '11월', en: 'Nov' }, { num: '12', kr: '12월', en: 'Dec' },
];

// STEP_META is now dynamically generated inside the component

/* ─── Mini Pillar ────────────────────────────────────────── */
function MiniPillar({ pillar, label }: { pillar: Pillar; label: string }) {
  return (
    <motion.div className="flex flex-col items-center"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}>
      <span style={{
        fontFamily: 'Pretendard, sans-serif', fontSize: '7px',
        color: '#bba689', letterSpacing: '0.1em', marginBottom: 4
      }}>{label}</span>
      <div className="flex flex-col items-center px-2.5 py-2"
        style={{
          border: '1px solid rgba(201,169,110,0.22)',
          background: 'rgba(201,169,110,0.04)', gap: 2
        }}>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: '26px',
          color: EL_COLORS[pillar.stemEl] || '#f5f0e8', lineHeight: 1
        }}>
          {pillar.stem}
        </span>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: '26px',
          color: EL_COLORS[pillar.branchEl] || '#f5f0e8', lineHeight: 1
        }}>
          {pillar.branch}
        </span>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────── */
interface FormState {
  name: string; birthYear: string; birthMonth: string; birthDay: string;
  birthHour: number; gender: 'male' | 'female' | ''; nationality: string; email: string;
}

export function Registry() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setUserInput, setIdentity, setShareCode } = useUser();
  const [step, setStep] = useState(0);

  const STEP_META = useMemo(() => [
    { icon: '名', ko: t('step0_ko', '이름을 알려주세요'), en: t('step0_en', 'Your full name, in English') },
    { icon: '年', ko: t('step1_ko', '태어난 해는?'), en: t('step1_en', 'Birth year  ·  1920 – 2010') },
    { icon: '月', ko: t('step2_ko', '태어난 달은?'), en: t('step2_en', 'Birth month') },
    { icon: '日', ko: t('step3_ko', '태어난 날은?'), en: t('step3_en', 'Birth day  ·  1 – 31') },
    { icon: '時', ko: t('step4_ko', '태어난 시각은?'), en: t('step4_en', 'Birth hour  ·  12 시진(時辰)') },
    { icon: '陰陽', ko: t('step5_ko', '성별은?'), en: t('step5_en', 'Gender · 음양의 기운') },
    { icon: '國', ko: t('step6_ko', '어느 나라에서 왔나요?'), en: t('step6_en', 'Nationality') },
    { icon: '✉', ko: t('step7_ko', '이메일 주소는?'), en: t('step7_en', 'Your results will be sent here') },
  ], [t]);
  const [form, setForm] = useState<FormState>({
    name: '', birthYear: '', birthMonth: '', birthDay: '',
    birthHour: 12, gender: '', nationality: '', email: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const liveSaju = useMemo(() => {
    const y = parseInt(form.birthYear), m = parseInt(form.birthMonth), d = parseInt(form.birthDay);
    if (!y || y < 1920 || y > 2010) return null;
    try { return calculateSaju(y, m || 6, d || 15, form.birthHour); } catch { return null; }
  }, [form.birthYear, form.birthMonth, form.birthDay, form.birthHour]);

  const hasYear = !!(liveSaju && parseInt(form.birthYear));
  const hasMonth = !!(hasYear && parseInt(form.birthMonth));
  const hasDay = !!(hasMonth && parseInt(form.birthDay));

  const validate = (): boolean => {
    const msgs: Record<number, () => string | null> = {
      0: () => !form.name.trim() ? t('err_name', '이름을 입력해주세요') : null,
      1: () => { const y = parseInt(form.birthYear); return (!y || y < 1920 || y > 2010) ? t('err_year', '1920–2010 사이의 연도') : null; },
      2: () => !form.birthMonth ? t('err_month', '월을 선택해주세요') : null,
      3: () => { const d = parseInt(form.birthDay); return (!d || d < 1 || d > 31) ? t('err_day', '1–31 사이의 날짜') : null; },
      4: () => null,
      5: () => !form.gender ? t('err_gender', '성별을 선택해주세요') : null,
      6: () => !form.nationality ? t('err_nationality', '국적을 선택해주세요') : null,
      7: () => !form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? t('err_email', '올바른 이메일을 입력해주세요') : null,
    };
    const msg = msgs[step]?.();
    if (msg) { setError(msg); return false; }
    setError(''); return true;
  };

  const isNextEnabled = (): boolean => {
    switch (step) {
      case 0: return form.name.trim().length > 0;
      case 1: { const y = parseInt(form.birthYear); return y >= 1920 && y <= 2010; }
      case 2: return !!form.birthMonth;
      case 3: { const d = parseInt(form.birthDay); return d >= 1 && d <= 31; }
      case 4: return true;
      case 5: return !!form.gender;
      case 6: return !!form.nationality;
      case 7: return !!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      default: return false;
    }
  };

  const goNext = async () => {
    if (!validate()) return;
    if (step < 7) { setStep(s => s + 1); setError(''); }
    else await handleSubmit();
  };

  const goBack = () => {
    if (step > 0) { setStep(s => s - 1); setError(''); }
    else navigate('/');
  };

  const autoAdvance = (update: Partial<FormState>) => {
    setForm(f => ({ ...f, ...update }));
    setError('');
    setTimeout(() => {
      if (step < 7) setStep(s => s + 1);
      else handleSubmit();
    }, 260);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const y = parseInt(form.birthYear) || 1990;
      const m = parseInt(form.birthMonth) || 6;
      const d = parseInt(form.birthDay) || 15;
      const h = form.birthHour ?? 12;

      let saju;
      try {
        saju = liveSaju ?? calculateSaju(y, m, d, h);
      } catch (err) {
        console.error('Saju calculation failed:', err);
        saju = calculateSaju(1990, 6, 15, 12);
      }

      const seed = (form.name + y + m + d).split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) & 0xffff, 0);

      const { getKoreanNameFromDB, getKoreanSurnameFromDB, generateShareCode, saveUserGeneration } = await import('../../lib/contentApi');
      const [dbSurname, dbName] = await Promise.all([
        getKoreanSurnameFromDB(seed),
        getKoreanNameFromDB(saju.lackingElement, (form.gender || 'male') as 'male' | 'female', seed)
      ]);

      const identity = generateKoreanIdentity(saju, (form.gender || 'male') as 'male' | 'female', form.name);

      if (dbSurname && dbName) {
        identity.surname = dbSurname.surname;
        identity.givenName = dbName.given;
        identity.fullName = dbSurname.surname + dbName.given;
        identity.fullNameRomanized = `${dbSurname.surname.toUpperCase()} ${dbName.romanized}`;
        identity.nameMeaning = `${dbSurname.meaning}\n\n${dbName.meaning}`;
      } else if (dbName) {
        identity.givenName = dbName.given;
        identity.fullName = identity.surname + dbName.given;
        identity.fullNameRomanized = `${identity.surname.toUpperCase()} ${dbName.romanized}`;
        identity.nameMeaning = `${dbName.meaning}`;
      }

      const userInputData = {
        name: form.name,
        birthYear: y,
        birthMonth: m,
        birthDay: d,
        birthHour: h,
        gender: (form.gender || 'male') as 'male' | 'female',
        nationality: form.nationality || 'Other',
        email: form.email,
        isLunar: false
      };

      const shareCode = generateShareCode();
      const userId = crypto.randomUUID();
      await saveUserGeneration(userId, form.email, form.name, identity.fullName, saju, shareCode, identity, userInputData);

      setUserInput(userInputData);
      setIdentity(identity);
      setShareCode(shareCode);
      trackCompleteRegistration({ gender: form.gender || 'male', nationality: form.nationality || 'Other' });
      navigate('/montage');
    } catch (err) {
      console.error('Submit failed:', err);
      setError(t('err_analysis_failed', '분석 중 오류가 발생했습니다. 다시 시도해주세요.'));
      setIsSubmitting(false);
    }
  };

  const topBgTint = step <= 4
    ? 'rgba(10,10,10,0.55)'
    : step === 5 ? 'rgba(0,0,20,0.7)'
      : step === 6 ? 'rgba(0,10,5,0.65)'
        : 'rgba(10,5,0,0.6)';

  const textInputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,169,110,0.28)', color: '#f5f0e8',
    padding: '16px 18px', fontSize: '20px', fontFamily: 'Pretendard, sans-serif',
    outline: 'none', letterSpacing: '0.02em', borderRadius: '8px',
  };

  const renderInput = () => {
    switch (step) {
      case 0:
        return (
          <input ref={inputRef} autoFocus type="text" placeholder={t('placeholder_name', "e.g. Emma Johansson")}
            value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') goNext(); }}
            autoComplete="name"
            style={textInputStyle} />
        );
      case 1:
        return (
          <input ref={inputRef} type="text" inputMode="numeric" pattern="[0-9]*" placeholder="1990"
            value={form.birthYear}
            onChange={e => { setForm(f => ({ ...f, birthYear: e.target.value })); setError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') goNext(); }}
            style={{ ...textInputStyle, fontSize: '38px', textAlign: 'center', letterSpacing: '0.1em' }} />
        );
      case 2:
        return (
          <div className="grid grid-cols-4 gap-2">
            {MONTHS.map(m => {
              const sel = form.birthMonth === m.num;
              return (
                <motion.button key={m.num} onClick={() => autoAdvance({ birthMonth: m.num })}
                  whileTap={{ scale: 0.92 }}
                  style={{
                    padding: '14px 4px', cursor: 'pointer', minHeight: '60px',
                    border: sel ? '1px solid rgba(201,169,110,0.85)' : '1px solid rgba(201,169,110,0.12)',
                    background: sel ? 'rgba(201,169,110,0.16)' : 'rgba(255,255,255,0.025)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'all 0.15s'
                  }}>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: '16px',
                    color: sel ? '#c9a96e' : '#a39585', lineHeight: 1
                  }}>{t(`month_${m.num}_kr`, m.kr)}</span>
                  <span style={{
                    fontFamily: 'Pretendard, sans-serif', fontSize: '9px',
                    color: sel ? '#c9a96e' : '#bba689'
                  }}>{t(`month_${m.num}_en`, m.en)}</span>
                </motion.button>
              );
            })}
          </div>
        );
      case 3:
        return (
          <input ref={inputRef} type="text" inputMode="numeric" pattern="[0-9]*" placeholder="15"
            value={form.birthDay}
            onChange={e => { setForm(f => ({ ...f, birthDay: e.target.value })); setError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') goNext(); }}
            style={{ ...textInputStyle, fontSize: '38px', textAlign: 'center', letterSpacing: '0.1em' }} />
        );
      case 4:
        return (
          <div style={{ maxHeight: '35vh', overflowY: 'auto', paddingRight: '4px' }}>
            {HOURS.map(h => {
              const sel = form.birthHour === h.value;
              return (
                <motion.button key={h.value} onClick={() => autoAdvance({ birthHour: h.value })}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '14px 16px', marginBottom: 4,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '48px',
                    border: sel ? '1px solid rgba(201,169,110,0.75)' : '1px solid rgba(201,169,110,0.08)',
                    background: sel ? 'rgba(201,169,110,0.12)' : 'rgba(255,255,255,0.015)',
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}>
                  <span style={{
                    fontFamily: 'Pretendard, sans-serif', fontSize: '14px',
                    color: sel ? '#c9a96e' : '#e8dcca'
                  }}>{t(`hour_${h.value}_label`, h.label)}</span>
                  <span style={{
                    fontFamily: 'Pretendard, sans-serif', fontSize: '11px',
                    color: sel ? '#c9a96e' : '#8a7255'
                  }}>{t(`hour_${h.value}_sub`, h.sub)}</span>
                </motion.button>
              );
            })}
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-2 gap-3">
            {([
              { g: 'female' as const, icon: '☽', ko: t('female_ko', '여성'), en: t('female_en', 'Female'), sub: t('female_sub', '음(陰)의 기운') },
              { g: 'male' as const, icon: '☀', ko: t('male_ko', '남성'), en: t('male_en', 'Male'), sub: t('male_sub', '양(陽)의 기운') },
            ]).map(({ g, icon, ko, en, sub }) => {
              const sel = form.gender === g;
              return (
                <motion.button key={g} onClick={() => autoAdvance({ gender: g })}
                  whileTap={{ scale: 0.94 }}
                  style={{
                    padding: '26px 12px', cursor: 'pointer', transition: 'all 0.2s', minHeight: '110px',
                    border: sel ? '1px solid rgba(201,169,110,0.8)' : '1px solid rgba(201,169,110,0.14)',
                    background: sel ? 'rgba(201,169,110,0.13)' : 'rgba(255,255,255,0.02)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5
                  }}>
                  <span style={{ fontSize: '32px', marginBottom: '4px' }}>{icon}</span>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif", fontSize: '24px',
                    color: sel ? '#c9a96e' : '#e8dcca', lineHeight: 1
                  }}>{ko}</span>
                  <span style={{
                    fontFamily: 'Pretendard, sans-serif', fontSize: '10px',
                    color: sel ? '#c9a96e' : '#bba689', letterSpacing: '0.1em'
                  }}>{en}</span>
                  <span style={{
                    fontFamily: 'Pretendard, sans-serif', fontSize: '9px',
                    color: sel ? 'rgba(201,169,110,0.6)' : '#8a7255', marginTop: '2px'
                  }}>{sub}</span>
                </motion.button>
              );
            })}
          </div>
        );
      case 6:
        return (
          <div style={{ maxHeight: '35vh', overflowY: 'auto', paddingRight: '4px' }}>
            {NATIONALITIES.map(n => {
              const sel = form.nationality === n.value;
              return (
                <motion.button key={n.value} onClick={() => autoAdvance({ nationality: n.value })}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '12px 16px', marginBottom: 4,
                    display: 'flex', alignItems: 'center', gap: 12, minHeight: '48px',
                    border: sel ? '1px solid rgba(201,169,110,0.75)' : '1px solid rgba(201,169,110,0.07)',
                    background: sel ? 'rgba(201,169,110,0.12)' : 'rgba(255,255,255,0.01)',
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}>
                  <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>{n.flag}</span>
                  <span style={{
                    fontFamily: 'Pretendard, sans-serif', fontSize: '14px',
                    color: sel ? '#c9a96e' : '#d1c5b4'
                  }}>{n.label}</span>
                </motion.button>
              );
            })}
          </div>
        );
      case 7:
        return (
          <input ref={inputRef} type="email" inputMode="email" placeholder="your@email.com"
            value={form.email}
            onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError(''); }}
            onKeyDown={e => { if (e.key === 'Enter') goNext(); }}
            autoComplete="email"
            style={textInputStyle} />
        );
      default: return null;
    }
  };

  const showNextBtn = [0, 1, 3, 7].includes(step);

  return (
    <div style={{
      height: '100svh', display: 'flex', flexDirection: 'column',
      backgroundColor: '#0a0a0a', overflow: 'hidden'
    }}>

      {/* ══ TOP VISUAL ══════════════════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ flex: 1, minHeight: '160px' }}>
        <img src={SEOUL_BG} alt="" className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.2, filter: 'blur(1px) saturate(0.5)' }} />
        <div className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${topBgTint} 0%, rgba(10,10,10,0.25) 50%, #0a0a0a 100%)`,
            transition: 'background 0.6s ease'
          }} />

        {/* 창살 pattern */}
        <div className="absolute left-0 top-0 bottom-0 pointer-events-none z-10"
          style={{ width: 24, opacity: 0.05 }}>
          <svg width="24" height="100%" style={{ height: '100%' }}>
            {Array.from({ length: 50 }).map((_, i) => (
              <g key={i}>
                <line x1="0" y1={i * 24} x2="24" y2={i * 24} stroke="#c9a96e" strokeWidth="0.5" />
                <line x1="12" y1={i * 24} x2="12" y2={(i + 1) * 24} stroke="#c9a96e" strokeWidth="0.5" />
              </g>
            ))}
          </svg>
        </div>

        {/* BG orb */}
        <motion.div className="absolute rounded-full pointer-events-none"
          key={`orb-${step}`}
          style={{
            width: 240, height: 240, top: '22%', left: '50%', transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)'
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />

        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 z-20">
          <motion.button onClick={goBack}
            style={{
              fontFamily: 'Pretendard, sans-serif', fontSize: '11px', color: '#bba689',
              background: 'none', border: 'none', cursor: 'pointer', zIndex: 10
            }}
            whileTap={{ scale: 0.95 }}>
            ← {step === 0 ? t('nav_home', '홈으로') : t('nav_prev', '이전')}
          </motion.button>

          <div className="flex flex-col items-center">
            <span style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: '17px',
              fontWeight: 300, color: '#c9a96e', letterSpacing: '0.16em'
            }}>K·REBORN</span>
            <span style={{
              fontFamily: 'Pretendard, sans-serif', fontSize: '7px',
              color: '#8a7255', letterSpacing: '0.1em'
            }}>🇰🇷 {t('seoul', '서울')}</span>
          </div>

          <div className="flex flex-col items-end z-10">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Progress dots */}
        <div className="absolute top-12 left-0 right-0 flex justify-center gap-1.5 z-20">
          {STEP_META.map((_, i) => (
            <motion.div key={i}
              animate={{ width: i === step ? 22 : 5 }}
              transition={{ duration: 0.3 }}
              style={{
                height: 3, borderRadius: 2,
                background: i < step ? '#e8dcca' : i === step ? '#c9a96e' : 'rgba(201,169,110,0.18)'
              }} />
          ))}
        </div>

        {/* Main step content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 z-10">
          <AnimatePresence mode="wait">
            <motion.div key={step}
              className="flex flex-col items-center text-center px-6 w-full"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}>

              {/* Live saju pillars */}
              {step >= 2 && liveSaju && (
                <motion.div className="flex items-end gap-3 mb-5"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  {hasDay && <MiniPillar pillar={liveSaju.hour} label={t("pillar_hour", "시")} />}
                  {hasDay && <MiniPillar pillar={liveSaju.day} label={t("pillar_day", "일")} />}
                  {hasMonth && <MiniPillar pillar={liveSaju.month} label={t("pillar_month", "월")} />}
                  {hasYear && <MiniPillar pillar={liveSaju.year} label={t("pillar_year", "년")} />}
                  {hasDay && (
                    <motion.div className="ml-1"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                      <span style={{
                        fontFamily: 'Pretendard, sans-serif', fontSize: '7px',
                        color: '#c9a96e', letterSpacing: '0.1em', display: 'block'
                      }}>✦ {t('saju_title', '팔자')}</span>
                      <span style={{
                        fontFamily: 'Pretendard, sans-serif', fontSize: '7px',
                        color: '#c9a96e', letterSpacing: '0.1em'
                      }}>{t('saju_complete', '완성')}</span>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step icon */}
              <motion.span key={`icon-${step}`}
                style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: '40px',
                  color: '#c9a96e', lineHeight: 1, marginBottom: 6, display: 'block'
                }}
                initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 0.9 }}
                transition={{ delay: 0.05, type: 'spring', stiffness: 120 }}>
                {STEP_META[step].icon}
              </motion.span>

              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: '26px',
                fontWeight: 300, color: '#f5f0e8', lineHeight: 1.25, marginBottom: 4
              }}>
                {STEP_META[step].ko}
              </h2>
              <p style={{
                fontFamily: 'Pretendard, sans-serif', fontSize: '10px',
                color: '#bba689', letterSpacing: '0.06em'
              }}>
                {STEP_META[step].en}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ══ BOTTOM SHEET ════════════════════════════════════════ */}
      <motion.div
        style={{
          background: 'rgba(13,11,9,0.99)', flexShrink: 0,
          borderTop: '1px solid rgba(201,169,110,0.18)',
          borderRadius: '20px 20px 0 0',
          maxHeight: 'calc(100svh - 160px)', display: 'flex', flexDirection: 'column'
        }}
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>

        <div className="flex justify-center pt-3.5 mb-1 shrink-0">
          <div style={{ width: 34, height: 3.5, borderRadius: 2, background: 'rgba(201,169,110,0.2)' }} />
        </div>

        <div className="px-5 pt-3 pb-8 overflow-y-auto" style={{ flex: 1 }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: '13px',
              color: '#c9a96e', opacity: 0.8
            }}>{STEP_META[step].icon}</span>
            <span style={{
              fontFamily: 'Pretendard, sans-serif', fontSize: '9px',
              color: '#bba689', letterSpacing: '0.2em', textTransform: 'uppercase'
            }}>
              {STEP_META[step].ko}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step}
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
              {renderInput()}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{
                  fontFamily: 'Pretendard, sans-serif', fontSize: '11px',
                  color: '#e07070', marginTop: 8
                }}>
                ⚠ {error}
              </motion.p>
            )}
          </AnimatePresence>

          {showNextBtn && (
            <motion.button onClick={goNext} disabled={isSubmitting} className="w-full mt-5"
              style={{
                padding: '15px 0', fontFamily: 'Pretendard, sans-serif', fontSize: '12px',
                letterSpacing: '0.2em', textTransform: 'uppercase', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                background: isNextEnabled() && !isSubmitting
                  ? 'linear-gradient(135deg, rgba(201,169,110,0.28), rgba(201,169,110,0.1))'
                  : 'rgba(255,255,255,0.025)',
                border: isNextEnabled() && !isSubmitting
                  ? '1px solid rgba(201,169,110,0.55)'
                  : '1px solid rgba(255,255,255,0.05)',
                color: isNextEnabled() && !isSubmitting ? '#f5f0e8' : '#2e2820',
                transition: 'all 0.2s'
              }}
              whileTap={isNextEnabled() && !isSubmitting ? { scale: 0.97 } : {}}>
              {step < 7 ? t('btn_next', '다음 →') : isSubmitting ? t('btn_analyzing', '분석 중…') : t('btn_start_analysis', '사주 분석 시작 →')}
            </motion.button>
          )}

          {!showNextBtn && step !== 4 && (
            <p className="text-center mt-4"
              style={{ fontFamily: 'Pretendard, sans-serif', fontSize: '9px', color: '#2a2018' }}>
              {t('auto_advance_msg', '선택하면 자동으로 넘어갑니다')}
            </p>
          )}
          {step === 4 && (
            <motion.button onClick={goNext} className="w-full mt-4"
              style={{
                padding: '13px 0', fontFamily: 'Pretendard, sans-serif', fontSize: '11px',
                letterSpacing: '0.18em', textTransform: 'uppercase', cursor: 'pointer',
                background: 'rgba(201,169,110,0.07)',
                border: '1px solid rgba(201,169,110,0.22)',
                color: '#e8dcca', transition: 'all 0.2s'
              }}
              whileTap={{ scale: 0.97 }}>
              {t('btn_next', '다음 →')}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}