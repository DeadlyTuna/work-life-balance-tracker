-- ============================================
-- WORK-LIFE BALANCE APP - DATABASE SETUP
-- ============================================
-- Run this in your Supabase SQL Editor
-- This will set up all tables and Row Level Security policies

-- ============================================
-- 1. ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. DROP EXISTING POLICIES (if any)
-- ============================================

DROP POLICY IF EXISTS "Users can view their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can insert their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON public.habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON public.habits;

DROP POLICY IF EXISTS "Users can view their own completions" ON public.habit_completions;
DROP POLICY IF EXISTS "Users can insert their own completions" ON public.habit_completions;
DROP POLICY IF EXISTS "Users can delete their own completions" ON public.habit_completions;

DROP POLICY IF EXISTS "Users can view their own logs" ON public.daily_logs;
DROP POLICY IF EXISTS "Users can insert their own logs" ON public.daily_logs;
DROP POLICY IF EXISTS "Users can update their own logs" ON public.daily_logs;
DROP POLICY IF EXISTS "Users can delete their own logs" ON public.daily_logs;

DROP POLICY IF EXISTS "Users can view their own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can insert their own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can update their own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can delete their own events" ON public.calendar_events;

-- ============================================
-- 3. CREATE RLS POLICIES FOR HABITS
-- ============================================

CREATE POLICY "Users can view their own habits"
  ON public.habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits"
  ON public.habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
  ON public.habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
  ON public.habits FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. CREATE RLS POLICIES FOR HABIT COMPLETIONS
-- ============================================

CREATE POLICY "Users can view their own completions"
  ON public.habit_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own completions"
  ON public.habit_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own completions"
  ON public.habit_completions FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 5. CREATE RLS POLICIES FOR DAILY LOGS
-- ============================================

CREATE POLICY "Users can view their own logs"
  ON public.daily_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
  ON public.daily_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs"
  ON public.daily_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs"
  ON public.daily_logs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 6. CREATE RLS POLICIES FOR CALENDAR EVENTS
-- ============================================

CREATE POLICY "Users can view their own events"
  ON public.calendar_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own events"
  ON public.calendar_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
  ON public.calendar_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
  ON public.calendar_events FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 7. ADD UNIQUE CONSTRAINTS (if not exists)
-- ============================================

-- Prevent duplicate habit completions for same date
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'habit_completions_unique'
  ) THEN
    ALTER TABLE public.habit_completions 
    ADD CONSTRAINT habit_completions_unique 
    UNIQUE (user_id, habit_id, completion_date);
  END IF;
END $$;

-- Prevent duplicate daily logs for same date
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'daily_logs_unique'
  ) THEN
    ALTER TABLE public.daily_logs 
    ADD CONSTRAINT daily_logs_unique 
    UNIQUE (user_id, date);
  END IF;
END $$;

-- ============================================
-- 8. VERIFICATION QUERIES
-- ============================================

-- Run these to verify setup:
-- SELECT * FROM pg_policies WHERE tablename IN ('habits', 'habit_completions', 'daily_logs', 'calendar_events');
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename IN ('habits', 'habit_completions', 'daily_logs', 'calendar_events');
