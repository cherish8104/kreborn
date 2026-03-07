-- ─────────────────────────────────────────────────────────────────
-- K-REBORN · Content Templates Schema v2 (Relational)
-- 기존의 단일 JSONB 테이블을 세분화하여, 서사 및 템플릿별로 각각의 테이블을 구성합니다.
-- ─────────────────────────────────────────────────────────────────

-- 1. 띠 (Chinese Zodiac)
CREATE TABLE IF NOT EXISTS public.saju_content_zodiac (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal TEXT NOT NULL UNIQUE,     -- 'Rat', 'Ox', ...
  kr TEXT NOT NULL,                -- '쥐', '소', ...
  emoji TEXT,
  trait TEXT,
  language TEXT DEFAULT 'ko',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 일주론 (Day Master Deep)
CREATE TABLE IF NOT EXISTS public.saju_content_day_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_master_id INTEGER NOT NULL UNIQUE, -- 0 to 9
  title TEXT NOT NULL,
  hanja TEXT NOT NULL,
  nature TEXT,
  strength TEXT[] DEFAULT '{}',
  caution TEXT[] DEFAULT '{}',
  korean_style TEXT,
  lucky_color TEXT,
  lucky_color_hex TEXT,
  lucky_number INTEGER,
  language TEXT DEFAULT 'ko',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 한국 생활 시나리오 (Daily Scenario)
CREATE TABLE IF NOT EXISTS public.saju_content_daily_scenario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_master_id INTEGER NOT NULL UNIQUE REFERENCES public.saju_content_day_master(day_master_id) ON DELETE CASCADE,
  morning TEXT,
  afternoon TEXT,
  evening TEXT,
  language TEXT DEFAULT 'ko',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. 과거 내러티브 (Past Narrative - 년주 천간)
CREATE TABLE IF NOT EXISTS public.saju_content_narrative_past (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stem_key TEXT NOT NULL UNIQUE,   -- '甲', '乙', ...
  title TEXT NOT NULL,
  keyword TEXT,
  narrative TEXT,
  language TEXT DEFAULT 'ko',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. 청춘(현재) 내러티브 (Youth Narrative - 월주 지지)
CREATE TABLE IF NOT EXISTS public.saju_content_narrative_youth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_key TEXT NOT NULL UNIQUE, -- '子', '丑', ...
  title TEXT NOT NULL,
  keyword TEXT,
  narrative TEXT,
  language TEXT DEFAULT 'ko',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. 미래(절정기) 내러티브 (Future Narrative - 년주 지지)
CREATE TABLE IF NOT EXISTS public.saju_content_narrative_future (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_key TEXT NOT NULL UNIQUE, -- '子', '丑', ...
  title TEXT NOT NULL,
  keyword TEXT,
  narrative TEXT,
  peak TEXT,                       -- 절정기 텍스트
  language TEXT DEFAULT 'ko',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. 운명의 짝 (Soulmate)
CREATE TABLE IF NOT EXISTS public.saju_content_soulmate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  element TEXT NOT NULL,           -- 'wood', 'fire', 'earth', 'metal', 'water'
  gender TEXT NOT NULL,            -- 'male', 'female' (사용자의 성별 반대)
  name TEXT NOT NULL,
  name_romanized TEXT,
  trait1 TEXT,
  trait2 TEXT,
  trait3 TEXT,
  description TEXT,
  compatibility_score INTEGER,
  language TEXT DEFAULT 'ko',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(element, gender)
);

-- 8. 동네 시나리오 (Neighborhood / Lucky Spot)
CREATE TABLE IF NOT EXISTS public.saju_content_neighborhood (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  element TEXT NOT NULL UNIQUE,    -- 'wood', 'fire', 'earth', 'metal', 'water'
  name TEXT NOT NULL,
  name_kr TEXT NOT NULL,
  description TEXT,
  vibe TEXT,
  language TEXT DEFAULT 'ko',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. 성씨 데이터베이스 (Surnames DB)
CREATE TABLE IF NOT EXISTS public.saju_content_surnames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surname TEXT NOT NULL UNIQUE,     -- '김', '이', '박' 등
  meaning TEXT NOT NULL,
  element TEXT,                    -- 오행 (선택사항)
  language TEXT DEFAULT 'ko',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. 1000 이름 데이터베이스 (Given Names DB)
CREATE TABLE IF NOT EXISTS public.saju_content_names (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  element TEXT NOT NULL,           -- 'wood', 'fire', 'earth', 'metal', 'water'
  gender TEXT NOT NULL,            -- 'male', 'female'
  given_name TEXT NOT NULL,        -- '민준', '서연' 등
  romanized TEXT NOT NULL,
  meaning TEXT NOT NULL,
  language TEXT DEFAULT 'ko',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(given_name, gender)
);


-- ── RLS Policies ─────────────────────────────────────────────────
-- 모든 콘텐츠 테이블은 누구나(익명 포함) 읽을 수 있도록 허용합니다.

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN 
    SELECT unnest(ARRAY[
      'saju_content_zodiac',
      'saju_content_day_master',
      'saju_content_daily_scenario',
      'saju_content_narrative_past',
      'saju_content_narrative_youth',
      'saju_content_narrative_future',
      'saju_content_soulmate',
      'saju_content_neighborhood',
      'saju_content_surnames',
      'saju_content_names'
    ])
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    
    -- 기존 정책 제거 (충돌 방지)
    EXECUTE format('DROP POLICY IF EXISTS "Anyone can read %I" ON public.%I;', t, t);
    
    -- 새 정책 추가 (누구나 SELECT)
    EXECUTE format('CREATE POLICY "Anyone can read %I" ON public.%I FOR SELECT USING (true);', t, t);
  END LOOP;
END
$$;
