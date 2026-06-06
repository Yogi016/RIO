import { fetchKecamatanBySlug } from '$lib/data/kecamatanService.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const kec = await fetchKecamatanBySlug(params.id);

  if (!kec) {
    error(404, {
      message: `Kecamatan "${params.id}" tidak ditemukan`,
    });
  }

  return {
    kec,
  };
}
