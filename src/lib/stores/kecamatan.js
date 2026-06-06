import { writable, derived } from 'svelte/store';
import data from '$lib/data/kecamatan.json';
import { calculateTotal } from '$lib/utils/formatters.js';

/** @type {import('svelte/store').Writable<Array>} */
export const kecamatanList = writable(data.kecamatan);

/** @type {import('svelte/store').Writable<string|null>} */
export const selectedKecamatanId = writable(null);

/** Derived: selected kecamatan object */
export const selectedKecamatan = derived(
  [kecamatanList, selectedKecamatanId],
  ([$list, $id]) => {
    if (!$id) return null;
    return $list.find((k) => k.id === $id) || null;
  }
);

/** Derived: aggregate summary stats across all kecamatan */
export const summaryStats = derived(kecamatanList, ($list) => {
  const totalPenduduk = $list.reduce((s, k) => s + k.penduduk.jumlahTotal, 0);

  const totalProduksiPertanian = $list.reduce(
    (s, k) => s + calculateTotal(k.pertanian, 'produksi'),
    0
  );

  const totalLuasPerkebunan = $list.reduce(
    (s, k) => s + calculateTotal(k.perkebunan, 'luasAreal'),
    0
  );

  const totalPopulasiTernak = $list.reduce(
    (s, k) => s + calculateTotal(k.peternakan, 'populasi'),
    0
  );

  return {
    totalKecamatan: $list.length,
    totalPenduduk,
    totalProduksiPertanian,
    totalLuasPerkebunan,
    totalPopulasiTernak,
  };
});
