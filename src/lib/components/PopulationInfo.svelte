<script>
  import { Users, UserCheck, Home, TrendingUp } from '@lucide/svelte';
  import { formatNumber } from '$lib/utils/formatters.js';

  /** @type {{ penduduk: Object }} */
  let { penduduk } = $props();

  const malePercent = $derived(
    ((penduduk.lakilaki / penduduk.jumlahTotal) * 100).toFixed(1)
  );
  const femalePercent = $derived(
    ((penduduk.perempuan / penduduk.jumlahTotal) * 100).toFixed(1)
  );
</script>

<div class="population glass-card">
  <h4 class="population__title">
    <Users size={18} />
    Data Kependudukan
  </h4>

  <div class="population__grid">
    <div class="population__item">
      <span class="population__item-label">Jumlah Penduduk</span>
      <span class="population__item-value">{formatNumber(penduduk.jumlahTotal)}</span>
      <span class="population__item-unit">jiwa</span>
    </div>

    <div class="population__item">
      <span class="population__item-label">Jumlah KK</span>
      <span class="population__item-value">{formatNumber(penduduk.jumlahKK)}</span>
      <span class="population__item-unit">KK</span>
    </div>

    <div class="population__item">
      <span class="population__item-label">Kepadatan</span>
      <span class="population__item-value">{penduduk.kepadatan}</span>
      <span class="population__item-unit">jiwa/km²</span>
    </div>

    <div class="population__item">
      <span class="population__item-label">Pertumbuhan</span>
      <span class="population__item-value population__growth">
        <TrendingUp size={14} />
        {penduduk.pertumbuhanPersen}%
      </span>
      <span class="population__item-unit">per tahun</span>
    </div>
  </div>

  <!-- Gender Distribution Bar -->
  <div class="population__gender">
    <div class="population__gender-header">
      <span>Komposisi Gender</span>
    </div>
    <div class="population__gender-bar">
      <div class="population__gender-male" style="width: {malePercent}%">
        <span>♂ {formatNumber(penduduk.lakilaki)} ({malePercent}%)</span>
      </div>
      <div class="population__gender-female" style="width: {femalePercent}%">
        <span>♀ {formatNumber(penduduk.perempuan)} ({femalePercent}%)</span>
      </div>
    </div>
  </div>
</div>

<style>
  .population {
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .population__title {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    font-size: 1rem;
    color: var(--accent-blue);
  }

  .population__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
  }

  .population__item {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: var(--space-md);
    background: hsl(210, 31%, 96%);
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-md);
  }

  .population__item-label {
    font-size: 0.72rem;
    color: var(--text-muted);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .population__item-value {
    font-size: 1.3rem;
    font-weight: 800;
    letter-spacing: 0;
  }

  .population__item-unit {
    font-size: 0.7rem;
    color: var(--text-secondary);
  }

  .population__growth {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--accent-green);
  }

  .population__gender {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .population__gender-header {
    font-size: 0.78rem;
    color: var(--text-secondary);
    font-weight: 600;
  }

  .population__gender-bar {
    display: flex;
    width: 100%;
    height: 36px;
    border-radius: var(--radius-sm);
    overflow: hidden;
  }

  .population__gender-male {
    background: linear-gradient(135deg, var(--accent-blue), hsl(220, 70%, 50%));
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width 1s ease;
  }

  .population__gender-female {
    background: linear-gradient(135deg, var(--accent-rose), hsl(320, 65%, 50%));
    display: flex;
    align-items: center;
    justify-content: center;
    transition: width 1s ease;
  }

  .population__gender-male span,
  .population__gender-female span {
    font-size: 0.68rem;
    font-weight: 600;
    color: white;
    white-space: nowrap;
    text-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.3);
  }

  @media (max-width: 480px) {
    .population__grid {
      grid-template-columns: 1fr;
    }

    .population__gender-male span,
    .population__gender-female span {
      font-size: 0.6rem;
    }
  }
</style>
