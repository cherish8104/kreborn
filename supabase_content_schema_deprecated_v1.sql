-- ─────────────────────────────────────────────────────────────────
-- K-REBORN · Content Templates Schema
-- 효율적인 템플릿 기반 콘텐츠 DB 설계 (단일 테이블 구조 + JSONB 활용)
-- ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.content_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,      -- 콘텐츠 유형 (ex: 'zodiac', 'day_master', 'youth_narrative', 'k_drama')
  lookup_key TEXT NOT NULL,    -- 조회용 키 (ex: '子', '0', 'wood', '甲')
  language TEXT DEFAULT 'ko',  -- 다국어 확장성 (ex: 'ko', 'en', 'th')
  content JSONB NOT NULL,      -- 실제 콘텐츠 데이터 (유형마다 구조가 달라도 JSONB로 모두 수용 가능)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- 중복 방지: 같은 언어/카테고리/키 조합은 하나만 존재해야 함
  UNIQUE(category, lookup_key, language)
);

-- 특정 키워드로 검색을 빠르게 하기 위한 인덱스 생성
CREATE INDEX idx_content_templates_lookup ON public.content_templates (category, lookup_key, language);

-- RLS (Row Level Security) 설정
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;

-- 1) 사용자(비회원 포함)는 누구나 읽을 수 있어야 함
CREATE POLICY "Anyone can read content templates" 
ON public.content_templates FOR SELECT USING (true);

-- 2) 쓰기 권한은 나중에 관리자(Admin)에게만 부여하도록 설정 가능
-- CREATE POLICY "Admin bulk insert" ON public.content_templates FOR ALL USING (auth.uid() = 'your-admin-uuid');


-- ─────────────────────────────────────────────────────────────────
-- 💡 데이터 삽입(Seed) 및 갈아끼우기 예시
-- JSONB 필드를 활용하므로 TypeScript의 인터페이스 형태 그대로 넣으면 됩니다.
-- ─────────────────────────────────────────────────────────────────

INSERT INTO public.content_templates (category, lookup_key, language, content)
VALUES 
  -- [예시 1] 띠 (Zodiac) 데이터
  (
    'zodiac', '子', 'ko', 
    '{"animal": "Rat", "kr": "쥐", "emoji": "🐀", "trait": "지혜롭고 민첩한 쥐띠. 재주가 많고 적응력이 뛰어나다."}'::jsonb
  ),
  
  -- [예시 2] 일주론 (Day Master) 데이터
  (
    'day_master', '0', 'ko',
    '{
       "title": "甲木 일간", "hanja": "甲", "nature": "大樹", 
       "strength": ["선구자적 리더십", "불굴의 의지"], 
       "caution": ["독단적 결정"], 
       "koreanStyle": "서울 성수동 브루어리 CEO", 
       "luckyColor": "초록", "luckyColorHex": "#4ade80", "luckyNumber": 3
     }'::jsonb
  ),

  -- [예시 3] K-드라마 페르소나 (오행 기준)
  (
    'k_drama', 'wood', 'ko',
    '{
       "archetype": "성장형 주인공", 
       "trope": "이태원 클라쓰의 불굴의 창업자", 
       "desc": "아무리 짓밟혀도 다시 일어나는 꺾이지 않는 잡초 서사입니다."
     }'::jsonb
  )
ON CONFLICT (category, lookup_key, language) 
DO UPDATE SET 
  content = EXCLUDED.content, 
  updated_at = timezone('utc'::text, now());
