-- Buat tabel informasi (jika belum ada)
CREATE TABLE IF NOT EXISTS informasi (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'published' NOT NULL
);

-- Index untuk date (untuk query yang efficient)
CREATE INDEX IF NOT EXISTS idx_informasi_date ON informasi(date);

-- Buat atau update RLS policy
ALTER TABLE informasi ENABLE ROW LEVEL SECURITY;

-- Policy read publik (anyone bisa baca)
DROP POLICY IF EXISTS "public_read_informasi" ON informasi;
CREATE POLICY "public_read_informasi" ON informasi
  FOR SELECT
  USING (true);

-- Policy authenticated user full akses
DROP POLICY IF EXISTS "auth_full_access_informasi" ON informasi;
CREATE POLICY "auth_full_access_informasi" ON informasi
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Trigger untuk updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_informasi_updated_at ON informasi;
CREATE TRIGGER trigger_update_informasi_updated_at
  BEFORE UPDATE ON informasi
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();