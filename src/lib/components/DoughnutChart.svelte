<script>
  import { onMount } from 'svelte';
  import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';
  import { CHART_COLORS, chartColorsAlpha, formatNumber } from '$lib/utils/formatters.js';

  Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

  /** @type {{ labels: string[], values: number[], title?: string, centerLabel?: string }} */
  let { labels, values, title = '', centerLabel = '' } = $props();

  /** @type {HTMLCanvasElement} */
  let canvas;
  /** @type {Chart|null} */
  let chart = null;

  const total = $derived(values.reduce((s, v) => s + v, 0));

  onMount(() => {
    createChart();
    return () => chart?.destroy();
  });

  $effect(() => {
    if (chart && labels && values) {
      chart.destroy();
      createChart();
    }
  });

  function createChart() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Center label plugin
    const centerTextPlugin = {
      id: 'centerText',
      afterDraw(chart) {
        if (!centerLabel) return;
        const { ctx, chartArea } = chart;
        const centerX = (chartArea.left + chartArea.right) / 2;
        const centerY = (chartArea.top + chartArea.bottom) / 2;

        ctx.save();
        ctx.textAlign = 'center';

        ctx.font = "800 1.4rem 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = 'hsl(214, 42%, 15%)';
        ctx.fillText(formatNumber(total), centerX, centerY - 4);

        ctx.font = "500 0.7rem 'Plus Jakarta Sans', sans-serif";
        ctx.fillStyle = 'hsl(215, 14%, 48%)';
        ctx.fillText(centerLabel, centerX, centerY + 16);

        ctx.restore();
      },
    };

    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: chartColorsAlpha(0.8),
            borderColor: CHART_COLORS,
            borderWidth: 1.5,
            hoverBorderWidth: 2,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        animation: {
          animateRotate: true,
          duration: 1000,
          easing: 'easeOutQuart',
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'hsl(215, 16%, 43%)',
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11.5, weight: '500' },
              padding: 14,
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
                const pct = ((ctx.parsed / total) * 100).toFixed(1);
                return ` ${ctx.label}: ${ctx.parsed.toLocaleString('id-ID')} (${pct}%)`;
              },
            },
          },
        },
      },
      plugins: centerLabel ? [centerTextPlugin] : [],
    });
  }
</script>

<div class="doughnut-chart glass-card">
  {#if title}
    <h4 class="doughnut-chart__title">{title}</h4>
  {/if}
  <div class="doughnut-chart__container">
    <canvas bind:this={canvas}></canvas>
  </div>
</div>

<style>
  .doughnut-chart {
    padding: var(--space-lg);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .doughnut-chart__title {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: 0;
  }

  .doughnut-chart__container {
    position: relative;
    height: 300px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>
