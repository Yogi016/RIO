import { fetchAllKecamatan } from '$lib/data/kecamatanService.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  const kecamatanList = await fetchAllKecamatan();

  return {
    kecamatanList,
  };
}
