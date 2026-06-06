<script>
  import { onMount } from 'svelte';
  import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
  import { CHART_COLORS, chartColorsAlpha } from '$lib/utils/formatters.js';

  Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

  /** @type {{ labels: string[], datasets: Array<{ label: string, data: number[] }>, title?: string, horizontal?: boolean }} */
  let { labels, datasets, title = '', horizontal = false } = $props();

  /** @type {HTMLCanvasElement} */
  let canvas;
  /** @type {Chart|null} */
  let chart = null;

  onMount(() => {
    createChart();
    return () => chart?.destroy();
  });

  $effect(() => {
    // Re-create chart when data changes
    if (chart && labels && datasets) {
      chart.destroy();
      createChart();
    }
  });

  function createChart() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: datasets.map((ds, i) => ({
          ...ds,
          backgroundColor: chartColorsAlpha(0.75)[i % CHART_COLORS.length],
          borderColor: CHART_COLORS[i % CHART_COLORS.length],
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        })),
      },
      options: {
        indexAxis: horizontal ? 'y' : 'x',
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 800,
          easing: 'easeOutQuart',
        },
        plugins: {
          legend: {
            display: datasets.length > 1,
            position: 'top',
            labels: {
              color: 'hsl(215, 16%, 43%)',
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 12, weight: '500' },
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 10,
            },
          },
          tooltip: {
            backgroundColor: 'hsl(0, 0%, 100%)',
            titleColor: 'hsl(214, 42%, 15%)',
            bodyColor: 'hsl(215, 16%, 43%)',
            borderColor: 'hsl(214, 24%, 88%)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            titleFont: { family: "'Plus Jakarta Sans', sans-serif", weight: '600' },
            bodyFont: { family: "'Plus Jakarta Sans', sans-serif" },
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed[horizontal ? 'x' : 'y'];
                return ` ${ctx.dataset.label}: ${val.toLocaleString('id-ID')}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'hsla(214, 24%, 72%, 0.22)',
              drawBorder: false,
            },
            ticks: {
              color: 'hsl(215, 14%, 48%)',
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
              maxRotation: 45,
            },
          },
          y: {
            grid: {
              color: 'hsla(214, 24%, 72%, 0.22)',
              drawBorder: false,
            },
            ticks: {
              color: 'hsl(215, 14%, 48%)',
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
              callback: (val) => {
                if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                return val;
              },
            },
          },
        },
      },
    });
  }
</script>

<div class="bar-chart glass-card">
  {#if title}
    <h4 class="bar-chart__title">{title}</h4>
  {/if}
  <div class="bar-chart__container">
    <canvas bind:this={canvas}></canvas>
  </div>
</div>

<style>
  .bar-chart {
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .bar-chart__title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: 0;
  }

  .bar-chart__container {
    position: relative;
    height: 300px;
    width: 100%;
  }
</style>
