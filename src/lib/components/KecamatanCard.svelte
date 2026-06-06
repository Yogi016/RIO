<script>
  import { MapPin, Users, ArrowRight } from '@lucide/svelte';
  import { calculateTotal, formatNumber, compactNumber } from '$lib/utils/formatters.js';

  /** @type {{ kec: Object, index?: number }} */
  let { kec, index = 0 } = $props();

  const totalProduksi = $derived(calculateTotal(kec.pertanian, 'produksi'));
  const topKomoditas = $derived(
    kec.perkebunan?.length
      ? kec.perkebunan.reduce((a, b) => (a.produksi > b.produksi ? a : b)).komoditas
      : '-'
  );
</script>

<a href="/kecamatan/{kec.id}" class="kecamatan-card glass-card" style="animation-delay: {index * 60}ms">
  <div class="kecamatan-card__header">
    <div class="kecamatan-card__title-group">
      <h3 class="kecamatan-card__name">{kec.nama}</h3>
      <span class="kecamatan-card__location">
        <MapPin size={12} />
        {kec.kabupaten}, {kec.provinsi}
      </span>
    </div>
    <span class="badge badge--blue">{kec.negaraTetangga}</span>
  </div>

  <div class="kecamatan-card__stats">
    <div class="kecamatan-card__stat">
      <span class="kecamatan-card__stat-value">{formatNumber(kec.penduduk.jumlahTotal)}</span>
      <span class="kecamatan-card__stat-label">Penduduk</span>
    </div>
    <div class="kecamatan-card__stat-divider"></div>
    <div class="kecamatan-card__stat">
      <span class="kecamatan-card__stat-value">{compactNumber(totalProduksi)}</span>
      <span class="kecamatan-card__stat-label">Ton Pertanian</span>
    </div>
    <div class="kecamatan-card__stat-divider"></div>
    <div class="kecamatan-card__stat">
      <span class="kecamatan-card__stat-value">{kec.pertanian?.length || 0}</span>
      <span class="kecamatan-card__stat-label">Komoditas</span>
    </div>
  </div>

  <div class="kecamatan-card__footer">
    <div class="kecamatan-card__tags">
      <span class="badge badge--green">{kec.plbn}</span>
      <span class="badge badge--orange">{topKomoditas}</span>
    </div>
    <span class="kecamatan-card__arrow">
      <ArrowRight size={16} />
    </span>
  </div>
</a>

<style>
  .kecamatan-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    padding: var(--space-lg);
    animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    cursor: pointer;
  }

  .kecamatan-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .kecamatan-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-sm);
  }

  .kecamatan-card__title-group {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .kecamatan-card__name {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--accent-navy);
  }

  .kecamatan-card__location {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .kecamatan-card__stats {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-sm) 0;
  }

  .kecamatan-card__stat {
    display: flex;
    flex-direction: column;
    gap: 1px;
    flex: 1;
  }

  .kecamatan-card__stat-value {
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: 0;
    color: var(--text-primary);
  }

  .kecamatan-card__stat-label {
    font-size: 0.68rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .kecamatan-card__stat-divider {
    width: 1px;
    height: 30px;
    background: var(--border-glass);
  }

  .kecamatan-card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--space-sm);
    border-top: 1px solid var(--border-glass);
  }

  .kecamatan-card__tags {
    display: flex;
    gap: var(--space-xs);
    flex-wrap: wrap;
  }

  .kecamatan-card__arrow {
    color: var(--text-muted);
    transition: all var(--transition-fast);
  }

  .kecamatan-card:hover .kecamatan-card__arrow {
    color: var(--accent-blue);
    transform: translateX(3px);
  }
</style>
