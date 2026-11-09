-- Tambah kolom status ke tabel informasi
ALTER TABLE informasi ADD COLUMN status TEXT DEFAULT 'published';

-- Update existing rows: jika date <= today, status = 'published', else 'pending'
UPDATE informasi
SET status = CASE
  WHEN date <= CURRENT_DATE THEN 'published'
  ELSE 'pending'
END;

-- Alter column agar tidak NULL
ALTER TABLE informasi ALTER COLUMN status SET NOT NULL;
