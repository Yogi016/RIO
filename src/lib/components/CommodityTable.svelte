<script>
  import { formatNumber } from '$lib/utils/formatters.js';
  import { ArrowUpDown } from '@lucide/svelte';

  /**
   * @type {{
   *   title: string,
   *   data: Array<Object>,
   *   columns: Array<{ key: string, label: string, unit?: string, align?: string }>,
   *   category?: string,
   *   showTotal?: boolean
   * }}
   */
  let { title, data, columns, category = 'pertanian', showTotal = true } = $props();

  let sortKey = $state('');
  let sortDir = $state(1); // 1 = asc, -1 = desc

  function toggleSort(key) {
    if (sortKey === key) {
      sortDir *= -1;
    } else {
      sortKey = key;
      sortDir = -1; // default desc
    }
  }

  const sorted = $derived(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey] ?? 0;
      const bVal = b[sortKey] ?? 0;
      if (typeof aVal === 'string') return aVal.localeCompare(bVal) * sortDir;
      return (aVal - bVal) * sortDir;
    });
  });

  const categoryColors = {
    pertanian: 'var(--accent-green)',
    perkebunan: 'var(--accent-orange)',
    peternakan: 'var(--accent-purple)',
  };

  const accentColor = $derived(categoryColors[category] || 'var(--accent-blue)');
</script>

<div class="commodity-table glass-card">
  <div class="commodity-table__header">
    <h4 class="commodity-table__title" style="color: {accentColor}">{title}</h4>
    <span class="commodity-table__count">{data.length} item</span>
  </div>

  <div class="commodity-table__scroll">
    <table>
      <thead>
        <tr>
          <th class="commodity-table__num">#</th>
          {#each columns as col}
            <th
              class:sortable={true}
              class:sorted={sortKey === col.key}
              style="text-align: {col.align || 'right'}"
              onclick={() => toggleSort(col.key)}
            >
              <span class="th-content">
                {col.label}
                {#if col.unit}
                  <span class="th-unit">({col.unit})</span>
                {/if}
                <ArrowUpDown size={12} class="sort-icon" />
              </span>
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each sorted() as row, i}
          <tr>
            <td class="commodity-table__num">{i + 1}</td>
            {#each columns as col}
              <td style="text-align: {col.align || 'right'}">
                {#if col.align === 'left'}
                  <span class="commodity-name">{row[col.key]}</span>
                {:else}
                  {formatNumber(row[col.key])}
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
      {#if showTotal && data.length > 0}
        <tfoot>
          <tr>
            <td class="commodity-table__num"></td>
            {#each columns as col}
              <td style="text-align: {col.align || 'right'}; font-weight: 700;">
                {#if col.align === 'left'}
                  Total
                {:else}
                  {formatNumber(data.reduce((s, r) => s + (r[col.key] || 0), 0))}
                {/if}
              </td>
            {/each}
          </tr>
        </tfoot>
      {/if}
    </table>
  </div>
</div>

<style>
  .commodity-table {
    padding: 0;
    overflow: hidden;
  }

  .commodity-table__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-md) var(--space-lg);
    border-bottom: 1px solid var(--border-glass);
    background: hsl(210, 40%, 99%);
  }

  .commodity-table__title {
    font-size: 0.95rem;
    font-weight: 700;
  }

  .commodity-table__count {
    font-size: 0.72rem;
    color: var(--text-muted);
    background: var(--accent-navy-soft);
    padding: 2px 8px;
    border-radius: var(--radius-full);
  }

  .commodity-table__scroll {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
  }

  thead {
    background: hsl(210, 31%, 96%);
  }

  th {
    padding: 0.6rem var(--space-md);
    font-weight: 600;
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    border-bottom: 1px solid var(--border-glass);
  }

  th:hover {
    color: var(--text-primary);
  }

  .th-content {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .th-unit {
    font-weight: 400;
    text-transform: none;
    opacity: 0.7;
  }

  :global(.sort-icon) {
    opacity: 0.3;
    transition: opacity var(--transition-fast);
  }

  th:hover :global(.sort-icon) {
    opacity: 0.7;
  }

  th.sorted :global(.sort-icon) {
    opacity: 1;
  }

  .commodity-table__num {
    width: 32px;
    text-align: center;
    color: var(--text-muted);
    font-size: 0.75rem;
  }

  td {
    padding: 0.6rem var(--space-md);
    border-bottom: 1px solid hsl(214, 24%, 91%);
    white-space: nowrap;
  }

  tbody tr {
    transition: background var(--transition-fast);
  }

  tbody tr:hover {
    background: hsl(210, 40%, 98%);
  }

  .commodity-name {
    font-weight: 600;
    color: var(--text-primary);
  }

  tfoot {
    background: hsl(210, 31%, 96%);
  }

  tfoot td {
    padding: 0.7rem var(--space-md);
    border-bottom: none;
    color: var(--text-primary);
  }
</style>
