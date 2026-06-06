<script>
  import { Building2, MapPin, Landmark, Users } from '@lucide/svelte';
  import { formatArea } from '$lib/utils/formatters.js';

  /** @type {{ administrasi: Object, plbn: string, negaraTetangga: string }} */
  let { administrasi, plbn, negaraTetangga } = $props();
</script>

<div class="admin glass-card">
  <h4 class="admin__title">
    <Building2 size={18} />
    Administrasi Pemerintahan
  </h4>

  <div class="admin__grid">
    <div class="admin__item">
      <div class="admin__item-icon" style="background: var(--accent-green-soft); color: var(--accent-green);">
        <Landmark size={16} />
      </div>
      <div class="admin__item-content">
        <span class="admin__item-label">Camat</span>
        <span class="admin__item-value">{administrasi.camat}</span>
      </div>
    </div>

    <div class="admin__item">
      <div class="admin__item-icon" style="background: var(--accent-blue-soft); color: var(--accent-blue);">
        <MapPin size={16} />
      </div>
      <div class="admin__item-content">
        <span class="admin__item-label">PLBN / Pos Perbatasan</span>
        <span class="admin__item-value">{plbn}</span>
      </div>
    </div>
  </div>

  <div class="admin__details">
    <div class="admin__detail">
      <span class="admin__detail-value">{formatArea(administrasi.luasWilayah)}</span>
      <span class="admin__detail-label">Luas Wilayah</span>
    </div>
    <div class="admin__detail">
      <span class="admin__detail-value">{administrasi.jumlahDesa}</span>
      <span class="admin__detail-label">Desa</span>
    </div>
    <div class="admin__detail">
      <span class="admin__detail-value">{administrasi.jumlahDusun}</span>
      <span class="admin__detail-label">Dusun</span>
    </div>
    <div class="admin__detail">
      <span class="admin__detail-value">{administrasi.jumlahRT}</span>
      <span class="admin__detail-label">RT</span>
    </div>
    <div class="admin__detail">
      <span class="admin__detail-value">{administrasi.jumlahRW}</span>
      <span class="admin__detail-label">RW</span>
    </div>
  </div>

  <div class="admin__neighbor">
    <span class="admin__neighbor-label">Berbatasan dengan</span>
    <span class="badge badge--blue">{negaraTetangga}</span>
  </div>
</div>

<style>
  .admin {
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .admin__title {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: 1rem;
    color: var(--accent-orange);
  }

  .admin__grid {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .admin__item {
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
    padding: var(--space-md);
    background: hsl(210, 31%, 96%);
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-md);
  }

  .admin__item-icon {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .admin__item-content {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .admin__item-label {
    font-size: 0.7rem;
    color: var(--text-muted);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .admin__item-value {
    font-size: 0.9rem;
    font-weight: 600;
  }

  .admin__details {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: var(--space-sm);
    text-align: center;
  }

  .admin__detail {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: var(--space-sm);
    background: hsl(210, 31%, 96%);
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-sm);
  }

  .admin__detail-value {
    font-size: 1rem;
    font-weight: 700;
  }

  .admin__detail-label {
    font-size: 0.65rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .admin__neighbor {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding-top: var(--space-sm);
    border-top: 1px solid var(--border-glass);
  }

  .admin__neighbor-label {
    font-size: 0.78rem;
    color: var(--text-secondary);
  }

  @media (max-width: 480px) {
    .admin__details {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
