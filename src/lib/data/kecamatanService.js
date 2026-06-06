// @ts-nocheck
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import staticData from '$lib/data/kecamatan.json';

const PUBLIC_SUPABASE_URL = env.PUBLIC_SUPABASE_URL;
const PUBLIC_SUPABASE_ANON_KEY = env.PUBLIC_SUPABASE_ANON_KEY;

/**
 * Check if Supabase is configured (env vars are real, not placeholder)
 */
const isSupabaseConfigured =
  PUBLIC_SUPABASE_URL &&
  PUBLIC_SUPABASE_ANON_KEY &&
  !PUBLIC_SUPABASE_URL.includes('your-project-id') &&
  PUBLIC_SUPABASE_URL.startsWith('https://');

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
const supabase = isSupabaseConfigured
  ? createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)
  : null;

/**
 * Fetch all kecamatan with nested relations from Supabase.
 * Falls back to static JSON if Supabase is not configured.
 * @returns {Promise<Array>}
 */
export async function fetchAllKecamatan() {
  if (!supabase) {
    return transformStaticData(staticData.kecamatan);
  }

  const { data, error } = await supabase
    .from('kecamatan')
    .select(`
      *,
      administrasi (*),
      penduduk (*),
      pertanian (*),
      perkebunan (*),
      peternakan (*)
    `)
    .order('nama');

  if (error) {
    console.error('[RIO] Supabase fetch error, falling back to static:', error.message);
    return transformStaticData(staticData.kecamatan);
  }

  return transformSupabaseData(data);
}

/**
 * Fetch single kecamatan by slug with all related data.
 * @param {string} slug
 * @returns {Promise<Object|null>}
 */
export async function fetchKecamatanBySlug(slug) {
  if (!supabase) {
    const kec = staticData.kecamatan.find((k) => k.id === slug);
    return kec ? transformStaticSingle(kec) : null;
  }

  const { data, error } = await supabase
    .from('kecamatan')
    .select(`
      *,
      administrasi (*),
      penduduk (*),
      pertanian (*),
      perkebunan (*),
      peternakan (*)
    `)
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('[RIO] Supabase fetch error for slug:', slug, error.message);
    const kec = staticData.kecamatan.find((k) => k.id === slug);
    return kec ? transformStaticSingle(kec) : null;
  }

  return transformSupabaseSingle(data);
}

/**
 * Transform Supabase response to match frontend expected shape.
 * Supabase returns snake_case; frontend expects camelCase.
 */
function transformSupabaseData(rows) {
  return rows.map(transformSupabaseSingle);
}

function transformSupabaseSingle(row) {
  const admin = row.administrasi?.[0] || row.administrasi || {};
  const pop = row.penduduk?.[0] || row.penduduk || {};

  return {
    id: row.slug,
    nama: row.nama,
    kabupaten: row.kabupaten,
    provinsi: row.provinsi,
    negaraTetangga: row.negara_tetangga,
    plbn: row.plbn,
    administrasi: {
      luasWilayah: Number(admin.luas_wilayah) || 0,
      jumlahDesa: admin.jumlah_desa || 0,
      jumlahDusun: admin.jumlah_dusun || 0,
      jumlahRT: admin.jumlah_rt || 0,
      jumlahRW: admin.jumlah_rw || 0,
      camat: admin.camat || '',
    },
    penduduk: {
      jumlahTotal: pop.jumlah_total || 0,
      lakilaki: pop.laki_laki || 0,
      perempuan: pop.perempuan || 0,
      kepadatan: Number(pop.kepadatan) || 0,
      jumlahKK: pop.jumlah_kk || 0,
      pertumbuhanPersen: Number(pop.pertumbuhan_persen) || 0,
    },
    pertanian: (row.pertanian || []).map((p) => ({
      komoditas: p.komoditas,
      luasTanam: Number(p.luas_tanam) || 0,
      luasPanen: Number(p.luas_panen) || 0,
      produksi: Number(p.produksi) || 0,
      produktivitas: Number(p.produktivitas) || 0,
    })),
    perkebunan: (row.perkebunan || []).map((p) => ({
      komoditas: p.komoditas,
      luasAreal: Number(p.luas_areal) || 0,
      produksi: Number(p.produksi) || 0,
      jumlahPetani: p.jumlah_petani || 0,
    })),
    peternakan: (row.peternakan || []).map((p) => ({
      jenis: p.jenis,
      populasi: p.populasi || 0,
      produksiDaging: Number(p.produksi_daging) || 0,
      produksiTelur: p.produksi_telur || 0,
    })),
  };
}

/**
 * Transform static JSON data (already in correct shape, just passthrough).
 */
function transformStaticData(kecamatanArr) {
  return kecamatanArr.map(transformStaticSingle);
}

function transformStaticSingle(kec) {
  return { ...kec };
}

/**
 * Menyimpan data kecamatan (tambah baru atau update).
 * @param {Object} kecData 
 * @returns {Promise<{success: boolean, local?: boolean, id: string}>}
 */
export async function saveKecamatan(kecData) {
  if (!supabase) {
    // Mode lokal (fallback ke local storage ditangani di level component/store)
    return { success: true, local: true, id: kecData.id };
  }

  // 1. Simpan/Upsert ke tabel kecamatan
  const { data: existing, error: findError } = await supabase
    .from('kecamatan')
    .select('id')
    .eq('slug', kecData.id)
    .maybeSingle();

  if (findError) {
    console.error('[RIO] Gagal memeriksa data kecamatan:', findError.message);
    throw new Error('Gagal memeriksa data kecamatan: ' + findError.message);
  }

  let uuid;
  const dbKec = {
    slug: kecData.id,
    nama: kecData.nama,
    kabupaten: kecData.kabupaten,
    provinsi: kecData.provinsi,
    negara_tetangga: kecData.negaraTetangga || null,
    plbn: kecData.plbn || null,
    tahun: 2024
  };

  if (existing) {
    uuid = existing.id;
    const { error: updateError } = await supabase
      .from('kecamatan')
      .update(dbKec)
      .eq('id', uuid);
    if (updateError) {
      console.error('[RIO] Gagal memperbarui kecamatan:', updateError.message);
      throw new Error('Gagal memperbarui kecamatan: ' + updateError.message);
    }
  } else {
    const { data: newKec, error: insertError } = await supabase
      .from('kecamatan')
      .insert(dbKec)
      .select('id')
      .single();
    if (insertError) {
      console.error('[RIO] Gagal menambah kecamatan:', insertError.message);
      throw new Error('Gagal menambah kecamatan: ' + insertError.message);
    }
    uuid = newKec.id;
  }

  // 2. Upsert Administrasi
  const dbAdmin = {
    kecamatan_id: uuid,
    luas_wilayah: Number(kecData.administrasi.luasWilayah) || 0,
    jumlah_desa: Number(kecData.administrasi.jumlahDesa) || 0,
    jumlah_dusun: Number(kecData.administrasi.jumlahDusun) || 0,
    jumlah_rt: Number(kecData.administrasi.jumlahRT) || 0,
    jumlah_rw: Number(kecData.administrasi.jumlahRW) || 0,
    camat: kecData.administrasi.camat || '',
    tahun: 2024
  };
  const { error: adminErr } = await supabase
    .from('administrasi')
    .upsert(dbAdmin, { onConflict: 'kecamatan_id, tahun' });
  if (adminErr) {
    console.error('[RIO] Gagal menyimpan administrasi:', adminErr.message);
    throw new Error('Gagal menyimpan data administrasi: ' + adminErr.message);
  }

  // 3. Upsert Penduduk
  const dbPop = {
    kecamatan_id: uuid,
    jumlah_total: Number(kecData.penduduk.jumlahTotal) || 0,
    laki_laki: Number(kecData.penduduk.lakilaki) || 0,
    perempuan: Number(kecData.penduduk.perempuan) || 0,
    kepadatan: Number(kecData.penduduk.kepadatan) || 0,
    jumlah_kk: Number(kecData.penduduk.jumlahKK) || 0,
    pertumbuhan_persen: Number(kecData.penduduk.pertumbuhanPersen) || 0,
    tahun: 2024
  };
  const { error: popErr } = await supabase
    .from('penduduk')
    .upsert(dbPop, { onConflict: 'kecamatan_id, tahun' });
  if (popErr) {
    console.error('[RIO] Gagal menyimpan penduduk:', popErr.message);
    throw new Error('Gagal menyimpan data kependudukan: ' + popErr.message);
  }

  // 4. Delete & Insert Ulang Tabel Potensi (Pertanian, Perkebunan, Peternakan)
  const { error: delPertanian } = await supabase.from('pertanian').delete().eq('kecamatan_id', uuid);
  if (delPertanian) {
    console.error('[RIO] Gagal mereset pertanian:', delPertanian.message);
    throw new Error('Gagal mereset data pertanian: ' + delPertanian.message);
  }
  if (kecData.pertanian?.length) {
    const dbPertanian = kecData.pertanian.map(p => ({
      kecamatan_id: uuid,
      komoditas: p.komoditas,
      luas_tanam: Number(p.luasTanam) || 0,
      luas_panen: Number(p.luasPanen) || 0,
      produksi: Number(p.produksi) || 0,
      produktivitas: Number(p.produktivitas) || 0,
      tahun: 2024
    }));
    const { error: insPertanian } = await supabase.from('pertanian').insert(dbPertanian);
    if (insPertanian) {
      console.error('[RIO] Gagal menyimpan pertanian:', insPertanian.message);
      throw new Error('Gagal menyimpan data pertanian: ' + insPertanian.message);
    }
  }

  const { error: delPerkebunan } = await supabase.from('perkebunan').delete().eq('kecamatan_id', uuid);
  if (delPerkebunan) {
    console.error('[RIO] Gagal mereset perkebunan:', delPerkebunan.message);
    throw new Error('Gagal mereset data perkebunan: ' + delPerkebunan.message);
  }
  if (kecData.perkebunan?.length) {
    const dbPerkebunan = kecData.perkebunan.map(p => ({
      kecamatan_id: uuid,
      komoditas: p.komoditas,
      luas_areal: Number(p.luasAreal) || 0,
      produksi: Number(p.produksi) || 0,
      jumlah_petani: Number(p.jumlahPetani) || 0,
      tahun: 2024
    }));
    const { error: insPerkebunan } = await supabase.from('perkebunan').insert(dbPerkebunan);
    if (insPerkebunan) {
      console.error('[RIO] Gagal menyimpan perkebunan:', insPerkebunan.message);
      throw new Error('Gagal menyimpan data perkebunan: ' + insPerkebunan.message);
    }
  }

  const { error: delPeternakan } = await supabase.from('peternakan').delete().eq('kecamatan_id', uuid);
  if (delPeternakan) {
    console.error('[RIO] Gagal mereset peternakan:', delPeternakan.message);
    throw new Error('Gagal mereset data peternakan: ' + delPeternakan.message);
  }
  if (kecData.peternakan?.length) {
    const dbPeternakan = kecData.peternakan.map(p => ({
      kecamatan_id: uuid,
      jenis: p.jenis,
      populasi: Number(p.populasi) || 0,
      produksi_daging: Number(p.produksiDaging) || 0,
      produksi_telur: Number(p.produksiTelur) || 0,
      tahun: 2024
    }));
    const { error: insPeternakan } = await supabase.from('peternakan').insert(dbPeternakan);
    if (insPeternakan) {
      console.error('[RIO] Gagal menyimpan peternakan:', insPeternakan.message);
      throw new Error('Gagal menyimpan data peternakan: ' + insPeternakan.message);
    }
  }

  return { success: true, id: kecData.id };
}

/**
 * Menghapus kecamatan beserta relasinya.
 * @param {string} slug 
 * @returns {Promise<{success: boolean, local?: boolean}>}
 */
export async function deleteKecamatan(slug) {
  if (!supabase) {
    return { success: true, local: true };
  }
  const { error } = await supabase
    .from('kecamatan')
    .delete()
    .eq('slug', slug);
  if (error) {
    console.error('[RIO] Gagal menghapus kecamatan:', error.message);
    throw new Error('Gagal menghapus kecamatan: ' + error.message);
  }
  return { success: true };
}

