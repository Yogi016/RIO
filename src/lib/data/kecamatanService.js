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
