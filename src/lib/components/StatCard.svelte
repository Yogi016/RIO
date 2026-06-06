<script>
  import { TrendingUp, TrendingDown, Minus } from '@lucide/svelte';
  import { formatNumber } from '$lib/utils/formatters.js';

  /** @type {{ icon: import('svelte').Component, label: string, value: number, unit?: string, color?: string, delay?: number }} */
  let { icon: Icon, label, value, unit = '', color = 'var(--accent-green)', delay = 0 } = $props();

  let displayed = $state(0);
  let visible = $state(false);

  /** @type {HTMLElement|undefined} */
  let el;

  $effect(() => {
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible = true;
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  });

  // Count-up animation
  $effect(() => {
    if (!visible) return;
    const duration = 1200;
    const start = performance.now();
    const target = value;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      displayed = Math.round(target * ease);
      if (progress < 1) requestAnimationFrame(tick);
    }

    setTimeout(() => requestAnimationFrame(tick), delay);
  });
</script>

<div class="stat-card glass-card" bind:this={el} style="--card-accent: {color}; animation-delay: {delay}ms">
  <div class="stat-card__icon" style="background: {color}15; color: {color}">
    <Icon size={22} />
  </div>
  <div class="stat-card__content">
    <span class="stat-card__label">{label}</span>
    <span class="stat-card__value">
      {formatNumber(displayed)}
      {#if unit}
        <span class="stat-card__unit">{unit}</span>
      {/if}
    </span>
  </div>
</div>

<style>
  .stat-card {
    padding: 1rem;
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
    position: relative;
    overflow: hidden;
    animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .stat-card__icon {
    width: 42px;
    height: 42px;
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid color-mix(in srgb, currentColor 16%, transparent);
  }

  .stat-card__content {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .stat-card__label {
    font-size: 0.76rem;
    color: var(--text-secondary);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .stat-card__value {
    font-size: 1.45rem;
    font-weight: 800;
    letter-spacing: 0;
    line-height: 1.1;
  }

  .stat-card__unit {
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

</style>
