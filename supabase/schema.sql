-- Translations table for TraducIA
-- Applied via Supabase MCP migration on 2025-05-15

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  source_language VARCHAR(10) NOT NULL,
  target_language VARCHAR(10) NOT NULL,
  cultural_notes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_translations_user_id ON translations(user_id);
CREATE INDEX IF NOT EXISTS idx_translations_created_at ON translations(created_at DESC);

ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own translations"
  ON translations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own translations"
  ON translations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own translations"
  ON translations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Note: FK to users(id) will be added once Auth.js creates the users table (first sign-up)
-- ALTER TABLE translations ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- User language settings table for TraducIA
-- Applied via Supabase MCP migration on 2025-05-15

CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  native_language TEXT NOT NULL DEFAULT 'es',
  target_languages JSONB NOT NULL DEFAULT '["en"]'::jsonb
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own settings"
  ON user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own settings"
  ON user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
