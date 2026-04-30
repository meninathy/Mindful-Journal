-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journals table
CREATE TABLE IF NOT EXISTS journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Entries table with AI analysis fields
CREATE TABLE IF NOT EXISTS entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_id UUID NOT NULL REFERENCES journals(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sentiment TEXT CHECK (sentiment IN ('Positive', 'Balanced', 'High-Distress')),
  distortions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insights table (AI-generated reflective prompts)
CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID UNIQUE NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  mirror_prompt TEXT,
  pattern_detected TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_journals_owner ON journals(owner_id);
CREATE INDEX IF NOT EXISTS idx_entries_journal ON entries(journal_id);
CREATE INDEX IF NOT EXISTS idx_entries_created ON entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_insights_entry ON insights(entry_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Journals RLS
CREATE POLICY "Users can CRUD own journals" ON journals
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Entries RLS (via journal ownership)
CREATE POLICY "Users can CRUD own entries" ON entries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM journals WHERE journals.id = entries.journal_id AND journals.owner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM journals WHERE journals.id = entries.journal_id AND journals.owner_id = auth.uid())
  );

-- Insights RLS (via entry -> journal ownership)
CREATE POLICY "Users can CRUD own insights" ON insights
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM entries e
      JOIN journals j ON j.id = e.journal_id
      WHERE e.id = insights.entry_id AND j.owner_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM entries e
      JOIN journals j ON j.id = e.journal_id
      WHERE e.id = insights.entry_id AND j.owner_id = auth.uid()
    )
  );

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER journals_updated_at BEFORE UPDATE ON journals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER entries_updated_at BEFORE UPDATE ON entries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
