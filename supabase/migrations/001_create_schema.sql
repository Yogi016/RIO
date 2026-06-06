-- ==========================================
-- RIO - Sistem Potensi Perbatasan Darat
-- Migration: create_rio_schema
-- Run this in Supabase SQL Editor
-- ==========================================

-- 1. Kecamatan (master table)
CREATE TABLE IF NOT EXISTS kecamatan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  kabupaten TEXT NOT NULL,
  provinsi TEXT NOT NULL,
  negara_tetangga TEXT,
  plbn TEXT,
  tahun INT NOT NULL DEFAULT 2024,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Administrasi
CREATE TABLE IF NOT EXISTS administrasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kecamatan_id UUID NOT NULL REFERENCES kecamatan(id) ON DELETE CASCADE,
  luas_wilayah NUMERIC(10,2),
  jumlah_desa INT,
  jumlah_dusun INT,
  jumlah_rt INT,
  jumlah_rw INT,
  camat TEXT,
  tahun INT NOT NULL DEFAULT 2024,
  UNIQUE(kecamatan_id, tahun)
);

-- 3. Penduduk
CREATE TABLE IF NOT EXISTS penduduk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kecamatan_id UUID NOT NULL REFERENCES kecamatan(id) ON DELETE CASCADE,
  jumlah_total INT,
  laki_laki INT,
  perempuan INT,
  kepadatan NUMERIC(10,2),
  jumlah_kk INT,
  pertumbuhan_persen NUMERIC(5,2),
  tahun INT NOT NULL DEFAULT 2024,
  UNIQUE(kecamatan_id, tahun)
);

-- 4. Pertanian
CREATE TABLE IF NOT EXISTS pertanian (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kecamatan_id UUID NOT NULL REFERENCES kecamatan(id) ON DELETE CASCADE,
  komoditas TEXT NOT NULL,
  luas_tanam NUMERIC(12,2),
  luas_panen NUMERIC(12,2),
  produksi NUMERIC(12,2),
  produktivitas NUMERIC(8,2),
  tahun INT NOT NULL DEFAULT 2024,
  UNIQUE(kecamatan_id, komoditas, tahun)
);

-- 5. Perkebunan
CREATE TABLE IF NOT EXISTS perkebunan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kecamatan_id UUID NOT NULL REFERENCES kecamatan(id) ON DELETE CASCADE,
  komoditas TEXT NOT NULL,
  luas_areal NUMERIC(12,2),
  produksi NUMERIC(12,2),
  jumlah_petani INT,
  tahun INT NOT NULL DEFAULT 2024,
  UNIQUE(kecamatan_id, komoditas, tahun)
);

-- 6. Peternakan
CREATE TABLE IF NOT EXISTS peternakan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kecamatan_id UUID NOT NULL REFERENCES kecamatan(id) ON DELETE CASCADE,
  jenis TEXT NOT NULL,
  populasi INT,
  produksi_daging NUMERIC(10,2),
  produksi_telur INT,
  tahun INT NOT NULL DEFAULT 2024,
  UNIQUE(kecamatan_id, jenis, tahun)
);

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_pertanian_kecamatan ON pertanian(kecamatan_id, tahun);
CREATE INDEX IF NOT EXISTS idx_perkebunan_kecamatan ON perkebunan(kecamatan_id, tahun);
CREATE INDEX IF NOT EXISTS idx_peternakan_kecamatan ON peternakan(kecamatan_id, tahun);
CREATE INDEX IF NOT EXISTS idx_kecamatan_slug ON kecamatan(slug);
CREATE INDEX IF NOT EXISTS idx_administrasi_kecamatan ON administrasi(kecamatan_id, tahun);
CREATE INDEX IF NOT EXISTS idx_penduduk_kecamatan ON penduduk(kecamatan_id, tahun);

-- ==========================================
-- UPDATED_AT TRIGGER
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS kecamatan_updated_at ON kecamatan;
CREATE TRIGGER kecamatan_updated_at
  BEFORE UPDATE ON kecamatan
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================
ALTER TABLE kecamatan ENABLE ROW LEVEL SECURITY;
ALTER TABLE administrasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE penduduk ENABLE ROW LEVEL SECURITY;
ALTER TABLE pertanian ENABLE ROW LEVEL SECURITY;
ALTER TABLE perkebunan ENABLE ROW LEVEL SECURITY;
ALTER TABLE peternakan ENABLE ROW LEVEL SECURITY;

-- Public read for all tables (anonymous + authenticated)
CREATE POLICY "public_read_kecamatan" ON kecamatan
  FOR SELECT USING (true);
CREATE POLICY "public_read_administrasi" ON administrasi
  FOR SELECT USING (true);
CREATE POLICY "public_read_penduduk" ON penduduk
  FOR SELECT USING (true);
CREATE POLICY "public_read_pertanian" ON pertanian
  FOR SELECT USING (true);
CREATE POLICY "public_read_perkebunan" ON perkebunan
  FOR SELECT USING (true);
CREATE POLICY "public_read_peternakan" ON peternakan
  FOR SELECT USING (true);

-- Authenticated write (admin only)
CREATE POLICY "auth_insert_kecamatan" ON kecamatan
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_kecamatan" ON kecamatan
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_kecamatan" ON kecamatan
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert_administrasi" ON administrasi
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_administrasi" ON administrasi
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_administrasi" ON administrasi
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert_penduduk" ON penduduk
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_penduduk" ON penduduk
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_penduduk" ON penduduk
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert_pertanian" ON pertanian
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_pertanian" ON pertanian
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_pertanian" ON pertanian
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert_perkebunan" ON perkebunan
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_perkebunan" ON perkebunan
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_perkebunan" ON perkebunan
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert_peternakan" ON peternakan
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "auth_update_peternakan" ON peternakan
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "auth_delete_peternakan" ON peternakan
  FOR DELETE USING (auth.role() = 'authenticated');

-- ==========================================
-- SUMMARY VIEW
-- ==========================================
CREATE OR REPLACE VIEW v_kecamatan_summary AS
SELECT
  k.id,
  k.slug,
  k.nama,
  k.kabupaten,
  k.provinsi,
  k.negara_tetangga,
  k.plbn,
  k.tahun,
  p.jumlah_total AS penduduk_total,
  COALESCE(pt.total_produksi_pertanian, 0) AS total_produksi_pertanian,
  COALESCE(pk.total_luas_perkebunan, 0) AS total_luas_perkebunan,
  COALESCE(tn.total_populasi_ternak, 0) AS total_populasi_ternak
FROM kecamatan k
LEFT JOIN penduduk p ON p.kecamatan_id = k.id AND p.tahun = k.tahun
LEFT JOIN LATERAL (
  SELECT SUM(produksi) AS total_produksi_pertanian
  FROM pertanian WHERE kecamatan_id = k.id AND tahun = k.tahun
) pt ON true
LEFT JOIN LATERAL (
  SELECT SUM(luas_areal) AS total_luas_perkebunan
  FROM perkebunan WHERE kecamatan_id = k.id AND tahun = k.tahun
) pk ON true
LEFT JOIN LATERAL (
  SELECT SUM(populasi) AS total_populasi_ternak
  FROM peternakan WHERE kecamatan_id = k.id AND tahun = k.tahun
) tn ON true;
