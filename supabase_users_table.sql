-- Supabase `users` table schema

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Tracks the authenticated user if logged in
  email TEXT NOT NULL,
  original_name TEXT NOT NULL,
  generated_surname TEXT NOT NULL,
  generated_given_name TEXT NOT NULL,
  generated_full_name TEXT NOT NULL,
  generated_romanized_name TEXT NOT NULL,
  saju_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read only their own data
CREATE POLICY "Users can view own data" ON public.users FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own data
CREATE POLICY "Users can insert own data" ON public.users FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Alternatively, if guests (unauthenticated) can save data, you might want to allow anonymous inserts:
-- CREATE POLICY "Anon users can insert" ON public.users FOR INSERT TO anon WITH CHECK (true);
