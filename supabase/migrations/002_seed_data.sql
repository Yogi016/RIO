-- ==========================================
-- RIO - Seed Data
-- Migrasi dari kecamatan.json → PostgreSQL
-- Run after 001_create_schema.sql
-- ==========================================

-- ==========================================
-- 1. KECAMATAN MASTER DATA
-- ==========================================

INSERT INTO kecamatan (slug, nama, kabupaten, provinsi, negara_tetangga, plbn, tahun) VALUES
  ('entikong',       'Entikong',        'Sanggau',      'Kalimantan Barat',  'Malaysia (Sarawak)', 'PLBN Entikong',     2024),
  ('badau',          'Badau',           'Kapuas Hulu',  'Kalimantan Barat',  'Malaysia (Sarawak)', 'PLBN Badau',        2024),
  ('jagoi-babang',   'Jagoi Babang',    'Bengkayang',   'Kalimantan Barat',  'Malaysia (Sarawak)', 'PLBN Aruk',         2024),
  ('paloh',          'Paloh',           'Sambas',       'Kalimantan Barat',  'Malaysia (Sarawak)', 'Pos Temajuk',       2024),
  ('sajingan-besar', 'Sajingan Besar',  'Sambas',       'Kalimantan Barat',  'Malaysia (Sarawak)', 'Pos Sajingan',      2024),
  ('sebatik',        'Sebatik',         'Nunukan',      'Kalimantan Utara',  'Malaysia (Sabah)',   'PLBN Sei Pancang',  2024);

-- ==========================================
-- 2. ADMINISTRASI
-- ==========================================

INSERT INTO administrasi (kecamatan_id, luas_wilayah, jumlah_desa, jumlah_dusun, jumlah_rt, jumlah_rw, camat, tahun)
SELECT id, 506.89, 5, 22, 85, 30, 'Drs. Antonius Naing, M.Si', 2024 FROM kecamatan WHERE slug = 'entikong'
UNION ALL
SELECT id, 700.20, 8, 34, 110, 42, 'Yohanes Edy, S.STP, M.Si', 2024 FROM kecamatan WHERE slug = 'badau'
UNION ALL
SELECT id, 655.00, 6, 28, 96, 36, 'Herkulanus, S.STP', 2024 FROM kecamatan WHERE slug = 'jagoi-babang'
UNION ALL
SELECT id, 1148.70, 7, 30, 105, 40, 'Rahmad Hidayat, S.STP', 2024 FROM kecamatan WHERE slug = 'paloh'
UNION ALL
SELECT id, 1391.20, 5, 20, 72, 28, 'Muhammad Arif, S.IP', 2024 FROM kecamatan WHERE slug = 'sajingan-besar'
UNION ALL
SELECT id, 246.60, 6, 18, 68, 24, 'Ir. Ahmad Fauzi', 2024 FROM kecamatan WHERE slug = 'sebatik';

-- ==========================================
-- 3. PENDUDUK
-- ==========================================

INSERT INTO penduduk (kecamatan_id, jumlah_total, laki_laki, perempuan, kepadatan, jumlah_kk, pertumbuhan_persen, tahun)
SELECT id, 18500, 9400, 9100, 36.50, 4200, 1.20, 2024 FROM kecamatan WHERE slug = 'entikong'
UNION ALL
SELECT id, 12800, 6500, 6300, 18.30, 3100, 0.90, 2024 FROM kecamatan WHERE slug = 'badau'
UNION ALL
SELECT id, 10200, 5300, 4900, 15.60, 2450, 1.00, 2024 FROM kecamatan WHERE slug = 'jagoi-babang'
UNION ALL
SELECT id, 14200, 7300, 6900, 12.40, 3500, 0.80, 2024 FROM kecamatan WHERE slug = 'paloh'
UNION ALL
SELECT id, 8500, 4400, 4100, 6.10, 2050, 0.70, 2024 FROM kecamatan WHERE slug = 'sajingan-besar'
UNION ALL
SELECT id, 22500, 11800, 10700, 91.20, 5400, 2.10, 2024 FROM kecamatan WHERE slug = 'sebatik';

-- ==========================================
-- 4. PERTANIAN
-- ==========================================

-- Entikong
INSERT INTO pertanian (kecamatan_id, komoditas, luas_tanam, luas_panen, produksi, produktivitas, tahun)
SELECT id, 'Padi Sawah',   1200, 1150, 4600, 4.0, 2024 FROM kecamatan WHERE slug = 'entikong'
UNION ALL SELECT id, 'Padi Ladang',  680, 650, 1625, 2.5, 2024 FROM kecamatan WHERE slug = 'entikong'
UNION ALL SELECT id, 'Jagung',       350, 320, 1280, 4.0, 2024 FROM kecamatan WHERE slug = 'entikong'
UNION ALL SELECT id, 'Ubi Kayu',     200, 190, 3800, 20.0, 2024 FROM kecamatan WHERE slug = 'entikong'
UNION ALL SELECT id, 'Ubi Jalar',    120, 110, 1540, 14.0, 2024 FROM kecamatan WHERE slug = 'entikong'
UNION ALL SELECT id, 'Kacang Tanah', 80, 75, 112, 1.5, 2024 FROM kecamatan WHERE slug = 'entikong';

-- Badau
INSERT INTO pertanian (kecamatan_id, komoditas, luas_tanam, luas_panen, produksi, produktivitas, tahun)
SELECT id, 'Padi Sawah',   850, 800, 3200, 4.0, 2024 FROM kecamatan WHERE slug = 'badau'
UNION ALL SELECT id, 'Padi Ladang',  920, 880, 2200, 2.5, 2024 FROM kecamatan WHERE slug = 'badau'
UNION ALL SELECT id, 'Jagung',       180, 165, 660, 4.0, 2024 FROM kecamatan WHERE slug = 'badau'
UNION ALL SELECT id, 'Ubi Kayu',     310, 295, 5900, 20.0, 2024 FROM kecamatan WHERE slug = 'badau'
UNION ALL SELECT id, 'Kacang Tanah', 55, 50, 75, 1.5, 2024 FROM kecamatan WHERE slug = 'badau';

-- Jagoi Babang
INSERT INTO pertanian (kecamatan_id, komoditas, luas_tanam, luas_panen, produksi, produktivitas, tahun)
SELECT id, 'Padi Sawah',  620, 590, 2360, 4.0, 2024 FROM kecamatan WHERE slug = 'jagoi-babang'
UNION ALL SELECT id, 'Padi Ladang', 750, 720, 1800, 2.5, 2024 FROM kecamatan WHERE slug = 'jagoi-babang'
UNION ALL SELECT id, 'Jagung',      220, 200, 800, 4.0, 2024 FROM kecamatan WHERE slug = 'jagoi-babang'
UNION ALL SELECT id, 'Ubi Kayu',    180, 170, 3400, 20.0, 2024 FROM kecamatan WHERE slug = 'jagoi-babang'
UNION ALL SELECT id, 'Sayuran',     95, 90, 540, 6.0, 2024 FROM kecamatan WHERE slug = 'jagoi-babang';

-- Paloh
INSERT INTO pertanian (kecamatan_id, komoditas, luas_tanam, luas_panen, produksi, produktivitas, tahun)
SELECT id, 'Padi Sawah',   1500, 1420, 5680, 4.0, 2024 FROM kecamatan WHERE slug = 'paloh'
UNION ALL SELECT id, 'Jagung',       280, 260, 1040, 4.0, 2024 FROM kecamatan WHERE slug = 'paloh'
UNION ALL SELECT id, 'Ubi Kayu',     150, 140, 2800, 20.0, 2024 FROM kecamatan WHERE slug = 'paloh'
UNION ALL SELECT id, 'Kacang Tanah', 70, 65, 97, 1.5, 2024 FROM kecamatan WHERE slug = 'paloh'
UNION ALL SELECT id, 'Sayuran',      110, 105, 630, 6.0, 2024 FROM kecamatan WHERE slug = 'paloh';

-- Sajingan Besar
INSERT INTO pertanian (kecamatan_id, komoditas, luas_tanam, luas_panen, produksi, produktivitas, tahun)
SELECT id, 'Padi Ladang', 950, 900, 2250, 2.5, 2024 FROM kecamatan WHERE slug = 'sajingan-besar'
UNION ALL SELECT id, 'Padi Sawah',  420, 400, 1600, 4.0, 2024 FROM kecamatan WHERE slug = 'sajingan-besar'
UNION ALL SELECT id, 'Jagung',      150, 140, 560, 4.0, 2024 FROM kecamatan WHERE slug = 'sajingan-besar'
UNION ALL SELECT id, 'Ubi Kayu',    250, 240, 4800, 20.0, 2024 FROM kecamatan WHERE slug = 'sajingan-besar';

-- Sebatik
INSERT INTO pertanian (kecamatan_id, komoditas, luas_tanam, luas_panen, produksi, produktivitas, tahun)
SELECT id, 'Padi Sawah', 580, 550, 2200, 4.0, 2024 FROM kecamatan WHERE slug = 'sebatik'
UNION ALL SELECT id, 'Jagung',    420, 400, 1600, 4.0, 2024 FROM kecamatan WHERE slug = 'sebatik'
UNION ALL SELECT id, 'Ubi Kayu',  180, 170, 3400, 20.0, 2024 FROM kecamatan WHERE slug = 'sebatik'
UNION ALL SELECT id, 'Sayuran',   250, 240, 1440, 6.0, 2024 FROM kecamatan WHERE slug = 'sebatik'
UNION ALL SELECT id, 'Pisang',    320, 310, 4650, 15.0, 2024 FROM kecamatan WHERE slug = 'sebatik';

-- ==========================================
-- 5. PERKEBUNAN
-- ==========================================

-- Entikong
INSERT INTO perkebunan (kecamatan_id, komoditas, luas_areal, produksi, jumlah_petani, tahun)
SELECT id, 'Kelapa Sawit', 5200, 15600, 2300, 2024 FROM kecamatan WHERE slug = 'entikong'
UNION ALL SELECT id, 'Karet',        3100, 2480, 1800, 2024 FROM kecamatan WHERE slug = 'entikong'
UNION ALL SELECT id, 'Lada',         450, 270, 600, 2024 FROM kecamatan WHERE slug = 'entikong'
UNION ALL SELECT id, 'Kakao',        320, 192, 420, 2024 FROM kecamatan WHERE slug = 'entikong'
UNION ALL SELECT id, 'Kelapa',       280, 336, 350, 2024 FROM kecamatan WHERE slug = 'entikong';

-- Badau
INSERT INTO perkebunan (kecamatan_id, komoditas, luas_areal, produksi, jumlah_petani, tahun)
SELECT id, 'Kelapa Sawit', 3800, 11400, 1700, 2024 FROM kecamatan WHERE slug = 'badau'
UNION ALL SELECT id, 'Karet',        4200, 3360, 2100, 2024 FROM kecamatan WHERE slug = 'badau'
UNION ALL SELECT id, 'Lada',         180, 108, 280, 2024 FROM kecamatan WHERE slug = 'badau'
UNION ALL SELECT id, 'Kakao',        150, 90, 200, 2024 FROM kecamatan WHERE slug = 'badau';

-- Jagoi Babang
INSERT INTO perkebunan (kecamatan_id, komoditas, luas_areal, produksi, jumlah_petani, tahun)
SELECT id, 'Kelapa Sawit', 4100, 12300, 1900, 2024 FROM kecamatan WHERE slug = 'jagoi-babang'
UNION ALL SELECT id, 'Karet',        2800, 2240, 1500, 2024 FROM kecamatan WHERE slug = 'jagoi-babang'
UNION ALL SELECT id, 'Lada',         620, 372, 750, 2024 FROM kecamatan WHERE slug = 'jagoi-babang'
UNION ALL SELECT id, 'Kakao',        250, 150, 310, 2024 FROM kecamatan WHERE slug = 'jagoi-babang'
UNION ALL SELECT id, 'Kopi',         180, 90, 240, 2024 FROM kecamatan WHERE slug = 'jagoi-babang';

-- Paloh
INSERT INTO perkebunan (kecamatan_id, komoditas, luas_areal, produksi, jumlah_petani, tahun)
SELECT id, 'Kelapa Sawit', 6200, 18600, 2800, 2024 FROM kecamatan WHERE slug = 'paloh'
UNION ALL SELECT id, 'Karet',        2500, 2000, 1400, 2024 FROM kecamatan WHERE slug = 'paloh'
UNION ALL SELECT id, 'Kelapa',       1800, 2160, 1100, 2024 FROM kecamatan WHERE slug = 'paloh'
UNION ALL SELECT id, 'Lada',         350, 210, 450, 2024 FROM kecamatan WHERE slug = 'paloh';

-- Sajingan Besar
INSERT INTO perkebunan (kecamatan_id, komoditas, luas_areal, produksi, jumlah_petani, tahun)
SELECT id, 'Kelapa Sawit', 3500, 10500, 1600, 2024 FROM kecamatan WHERE slug = 'sajingan-besar'
UNION ALL SELECT id, 'Karet',        3800, 3040, 1900, 2024 FROM kecamatan WHERE slug = 'sajingan-besar'
UNION ALL SELECT id, 'Lada',         280, 168, 380, 2024 FROM kecamatan WHERE slug = 'sajingan-besar';

-- Sebatik
INSERT INTO perkebunan (kecamatan_id, komoditas, luas_areal, produksi, jumlah_petani, tahun)
SELECT id, 'Kelapa Sawit', 7500, 22500, 3200, 2024 FROM kecamatan WHERE slug = 'sebatik'
UNION ALL SELECT id, 'Kelapa',       1200, 1440, 800, 2024 FROM kecamatan WHERE slug = 'sebatik'
UNION ALL SELECT id, 'Kakao',        850, 510, 650, 2024 FROM kecamatan WHERE slug = 'sebatik'
UNION ALL SELECT id, 'Kopi',         200, 100, 180, 2024 FROM kecamatan WHERE slug = 'sebatik';

-- ==========================================
-- 6. PETERNAKAN
-- ==========================================

-- Entikong
INSERT INTO peternakan (kecamatan_id, jenis, populasi, produksi_daging, produksi_telur, tahun)
SELECT id, 'Sapi',          1200, 85, 0, 2024 FROM kecamatan WHERE slug = 'entikong'
UNION ALL SELECT id, 'Babi',          3500, 210, 0, 2024 FROM kecamatan WHERE slug = 'entikong'
UNION ALL SELECT id, 'Kambing',       450, 18, 0, 2024 FROM kecamatan WHERE slug = 'entikong'
UNION ALL SELECT id, 'Ayam Kampung',  15000, 45, 180000, 2024 FROM kecamatan WHERE slug = 'entikong'
UNION ALL SELECT id, 'Ayam Ras',      8000, 32, 420000, 2024 FROM kecamatan WHERE slug = 'entikong'
UNION ALL SELECT id, 'Itik',          2200, 8, 95000, 2024 FROM kecamatan WHERE slug = 'entikong';

-- Badau
INSERT INTO peternakan (kecamatan_id, jenis, populasi, produksi_daging, produksi_telur, tahun)
SELECT id, 'Sapi',          850, 60, 0, 2024 FROM kecamatan WHERE slug = 'badau'
UNION ALL SELECT id, 'Babi',          4200, 252, 0, 2024 FROM kecamatan WHERE slug = 'badau'
UNION ALL SELECT id, 'Kambing',       280, 11, 0, 2024 FROM kecamatan WHERE slug = 'badau'
UNION ALL SELECT id, 'Ayam Kampung',  12000, 36, 144000, 2024 FROM kecamatan WHERE slug = 'badau'
UNION ALL SELECT id, 'Itik',          1800, 6, 78000, 2024 FROM kecamatan WHERE slug = 'badau';

-- Jagoi Babang
INSERT INTO peternakan (kecamatan_id, jenis, populasi, produksi_daging, produksi_telur, tahun)
SELECT id, 'Sapi',          680, 48, 0, 2024 FROM kecamatan WHERE slug = 'jagoi-babang'
UNION ALL SELECT id, 'Babi',          2800, 168, 0, 2024 FROM kecamatan WHERE slug = 'jagoi-babang'
UNION ALL SELECT id, 'Kambing',       350, 14, 0, 2024 FROM kecamatan WHERE slug = 'jagoi-babang'
UNION ALL SELECT id, 'Ayam Kampung',  11000, 33, 132000, 2024 FROM kecamatan WHERE slug = 'jagoi-babang'
UNION ALL SELECT id, 'Ayam Ras',      5000, 20, 260000, 2024 FROM kecamatan WHERE slug = 'jagoi-babang'
UNION ALL SELECT id, 'Itik',          1500, 5, 65000, 2024 FROM kecamatan WHERE slug = 'jagoi-babang';

-- Paloh
INSERT INTO peternakan (kecamatan_id, jenis, populasi, produksi_daging, produksi_telur, tahun)
SELECT id, 'Sapi',          1500, 105, 0, 2024 FROM kecamatan WHERE slug = 'paloh'
UNION ALL SELECT id, 'Kambing',       620, 25, 0, 2024 FROM kecamatan WHERE slug = 'paloh'
UNION ALL SELECT id, 'Ayam Kampung',  18000, 54, 216000, 2024 FROM kecamatan WHERE slug = 'paloh'
UNION ALL SELECT id, 'Ayam Ras',      10000, 40, 520000, 2024 FROM kecamatan WHERE slug = 'paloh'
UNION ALL SELECT id, 'Itik',          3000, 10, 130000, 2024 FROM kecamatan WHERE slug = 'paloh';

-- Sajingan Besar
INSERT INTO peternakan (kecamatan_id, jenis, populasi, produksi_daging, produksi_telur, tahun)
SELECT id, 'Sapi',          550, 38, 0, 2024 FROM kecamatan WHERE slug = 'sajingan-besar'
UNION ALL SELECT id, 'Babi',          2100, 126, 0, 2024 FROM kecamatan WHERE slug = 'sajingan-besar'
UNION ALL SELECT id, 'Kambing',       200, 8, 0, 2024 FROM kecamatan WHERE slug = 'sajingan-besar'
UNION ALL SELECT id, 'Ayam Kampung',  9000, 27, 108000, 2024 FROM kecamatan WHERE slug = 'sajingan-besar'
UNION ALL SELECT id, 'Itik',          1200, 4, 52000, 2024 FROM kecamatan WHERE slug = 'sajingan-besar';

-- Sebatik
INSERT INTO peternakan (kecamatan_id, jenis, populasi, produksi_daging, produksi_telur, tahun)
SELECT id, 'Sapi',          2200, 154, 0, 2024 FROM kecamatan WHERE slug = 'sebatik'
UNION ALL SELECT id, 'Kambing',       800, 32, 0, 2024 FROM kecamatan WHERE slug = 'sebatik'
UNION ALL SELECT id, 'Ayam Kampung',  20000, 60, 240000, 2024 FROM kecamatan WHERE slug = 'sebatik'
UNION ALL SELECT id, 'Ayam Ras',      15000, 60, 780000, 2024 FROM kecamatan WHERE slug = 'sebatik'
UNION ALL SELECT id, 'Itik',          3500, 12, 152000, 2024 FROM kecamatan WHERE slug = 'sebatik';
