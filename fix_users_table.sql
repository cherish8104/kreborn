-- 1. Fix the users table schema to support share code and identity data
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS generated_korean_name TEXT,
  ADD COLUMN IF NOT EXISTS share_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS identity_data JSONB,
  ADD COLUMN IF NOT EXISTS user_input_data JSONB,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS nationality TEXT,
  ADD COLUMN IF NOT EXISTS birth_year INTEGER,
  ADD COLUMN IF NOT EXISTS birth_month INTEGER,
  ADD COLUMN IF NOT EXISTS birth_day INTEGER,
  ADD COLUMN IF NOT EXISTS birth_hour INTEGER;

-- 2. Make existing NOT NULL columns nullable, since the current API logic no longer requires them
ALTER TABLE public.users
  ALTER COLUMN generated_surname DROP NOT NULL,
  ALTER COLUMN generated_given_name DROP NOT NULL,
  ALTER COLUMN generated_full_name DROP NOT NULL,
  ALTER COLUMN generated_romanized_name DROP NOT NULL;

-- 3. Fix RLS (Row Level Security) policies so anonymous users can save (upsert requires UPDATE) and read shared results
DROP POLICY IF EXISTS "Anon users can do everything" ON public.users;
CREATE POLICY "Anon users can do everything" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- 4. Allow authenticated users (Admin) to query all users
DROP POLICY IF EXISTS "Auth users can view all data" ON public.users;
CREATE POLICY "Auth users can view all data" ON public.users FOR SELECT TO authenticated USING (true);

-- 5. Lemon Squeezy 결제 추적 컬럼 추가
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_paid BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS lemon_order_id TEXT;
