-- ============================================================
-- 升本冲刺 - Supabase 数据库迁移脚本
-- 在 Supabase SQL Editor 中运行此脚本即可完成建表
-- ============================================================

-- 设置表（每个用户一行）
CREATE TABLE IF NOT EXISTS public.settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  exam_date DATE NOT NULL DEFAULT '2026-04-11',
  math_target INT NOT NULL DEFAULT 120,
  english_target INT NOT NULL DEFAULT 100,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 学习记录表（每日一条）
CREATE TABLE IF NOT EXISTS public.study_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_minutes INT NOT NULL DEFAULT 0,
  checked_in BOOLEAN NOT NULL DEFAULT false,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 学习会话表（每次计时一条）
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  start_time BIGINT NOT NULL,
  end_time BIGINT NOT NULL,
  duration_minutes INT NOT NULL,
  subject TEXT NOT NULL CHECK (subject IN ('math', 'english', 'other')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 模拟考试表
CREATE TABLE IF NOT EXISTS public.mock_exams (
  id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  subject TEXT NOT NULL CHECK (subject IN ('math', 'english')),
  score INT NOT NULL,
  total_score INT NOT NULL DEFAULT 150,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id, user_id)
);

-- 快捷链接表
CREATE TABLE IF NOT EXISTS public.quick_links (
  id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('course', 'official', 'collection', 'resource', 'other')),
  icon TEXT,
  sort_order INT DEFAULT 0,
  PRIMARY KEY (id, user_id)
);

-- ═══ RLS 策略 ═══
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_links ENABLE ROW LEVEL SECURITY;

-- 插入时自动填充 user_id
CREATE OR REPLACE FUNCTION public.set_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS settings_user_id ON public.settings;
CREATE TRIGGER settings_user_id BEFORE INSERT ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.set_user_id();

DROP TRIGGER IF EXISTS study_records_user_id ON public.study_records;
CREATE TRIGGER study_records_user_id BEFORE INSERT ON public.study_records
  FOR EACH ROW EXECUTE FUNCTION public.set_user_id();

DROP TRIGGER IF EXISTS study_sessions_user_id ON public.study_sessions;
CREATE TRIGGER study_sessions_user_id BEFORE INSERT ON public.study_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_user_id();

DROP TRIGGER IF EXISTS mock_exams_user_id ON public.mock_exams;
CREATE TRIGGER mock_exams_user_id BEFORE INSERT ON public.mock_exams
  FOR EACH ROW EXECUTE FUNCTION public.set_user_id();

DROP TRIGGER IF EXISTS quick_links_user_id ON public.quick_links;
CREATE TRIGGER quick_links_user_id BEFORE INSERT ON public.quick_links
  FOR EACH ROW EXECUTE FUNCTION public.set_user_id();

-- 用户只能访问自己的数据
DROP POLICY IF EXISTS own_settings ON public.settings;
CREATE POLICY own_settings ON public.settings FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS own_records ON public.study_records;
CREATE POLICY own_records ON public.study_records FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS own_sessions ON public.study_sessions;
CREATE POLICY own_sessions ON public.study_sessions FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS own_exams ON public.mock_exams;
CREATE POLICY own_exams ON public.mock_exams FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS own_links ON public.quick_links;
CREATE POLICY own_links ON public.quick_links FOR ALL USING (auth.uid() = user_id);
