import { writable, derived } from 'svelte/store';
import { calculateTotal } from '$lib/utils/formatters.js';

/**
 * Kecamatan list store.
 * Hydrated from +page.server.js data or static JSON fallback.
 * @type {import('svelte/store').Writable<Array>}
 */
export const kecamatanList = writable([]);

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
  if (!$list.length) {
    return {
      totalKecamatan: 0,
      totalPenduduk: 0,
      totalProduksiPertanian: 0,
      totalLuasPerkebunan: 0,
      totalPopulasiTernak: 0,
    };
  }

  const totalPenduduk = $list.reduce((s, k) => s + (k.penduduk?.jumlahTotal || 0), 0);

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
