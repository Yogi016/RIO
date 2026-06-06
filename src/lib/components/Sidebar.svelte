<script>
  import { page } from '$app/state';
  import { kecamatanList } from '$lib/stores/kecamatan.js';
  import { MapPin, LayoutDashboard, BarChart3, Menu, X, Database } from '@lucide/svelte';

  let mobileOpen = $state(false);

  const currentPath = $derived(page.url.pathname);

  function closeMobile() {
    mobileOpen = false;
  }
</script>

<!-- Mobile Toggle -->
<button
  class="sidebar-toggle"
  onclick={() => (mobileOpen = !mobileOpen)}
  aria-label="Toggle menu"
>
  {#if mobileOpen}
    <X size={22} />
  {:else}
    <Menu size={22} />
  {/if}
</button>

<!-- Overlay -->
{#if mobileOpen}
  <div class="sidebar-overlay" onclick={closeMobile} role="presentation"></div>
{/if}

<aside class="sidebar" class:open={mobileOpen}>
  <!-- Brand -->
  <a href="/" class="sidebar__brand" onclick={closeMobile}>
    <div class="sidebar__logo">
      <BarChart3 size={22} strokeWidth={2.5} />
    </div>
    <div class="sidebar__brand-text">
      <span class="sidebar__title">RIO</span>
      <span class="sidebar__subtitle">Portal Statistik Wilayah</span>
    </div>
  </a>

  <!-- Nav -->
  <nav class="sidebar__nav">
    <a
      href="/"
      class="sidebar__link"
      class:active={currentPath === '/'}
      onclick={closeMobile}
    >
      <LayoutDashboard size={18} />
      <span>Dashboard</span>
    </a>

    <div class="sidebar__section-title">Sumber</div>
    <div class="sidebar__source">
      <Database size={15} />
      <span>Dummy indikator mengikuti struktur publikasi BPS</span>
    </div>

    <div class="sidebar__section-title">Kecamatan Perbatasan</div>

    {#each $kecamatanList as kec (kec.id)}
      <a
        href="/kecamatan/{kec.id}"
        class="sidebar__link"
        class:active={currentPath === `/kecamatan/${kec.id}`}
        onclick={closeMobile}
      >
        <MapPin size={16} />
        <span>{kec.nama}</span>
        <span class="sidebar__link-badge">{kec.kabupaten}</span>
      </a>
    {/each}
  </nav>

  <!-- Footer -->
  <div class="sidebar__footer">
    <p>Basis tampilan: Tahun Data 2024</p>
    <p>Wilayah contoh: Kalbar & Kaltara</p>
  </div>
</aside>

<style>
  .sidebar-toggle {
    display: none;
    position: fixed;
    top: var(--space-md);
    left: var(--space-md);
    z-index: 1001;
    width: 42px;
    height: 42px;
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    border: 1px solid var(--border-glass);
    color: var(--accent-navy);
    box-shadow: var(--shadow-md);
    align-items: center;
    justify-content: center;
  }

  .sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: hsla(214, 42%, 15%, 0.35);
    z-index: 999;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: var(--sidebar-width);
    background: linear-gradient(180deg, var(--accent-navy) 0%, hsl(213, 48%, 23%) 100%);
    border-right: 1px solid var(--border-glass);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    overflow-y: auto;
  }

  .sidebar__brand {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: var(--space-lg) var(--space-lg);
    border-bottom: 1px solid hsla(0, 0%, 100%, 0.12);
    color: white;
  }

  .sidebar__logo {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-md);
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-navy);
    flex-shrink: 0;
  }

  .sidebar__brand-text {
    display: flex;
    flex-direction: column;
  }

  .sidebar__title {
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: 0;
    line-height: 1.1;
  }

  .sidebar__subtitle {
    font-size: 0.7rem;
    color: hsla(0, 0%, 100%, 0.68);
    font-weight: 500;
    letter-spacing: 0;
  }

  .sidebar__nav {
    flex: 1;
    padding: var(--space-md) var(--space-sm);
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sidebar__section-title {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: hsla(0, 0%, 100%, 0.48);
    padding: var(--space-md) var(--space-sm) var(--space-xs);
  }

  .sidebar__link {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    padding: 0.55rem 0.75rem;
    border-radius: var(--radius-sm);
    font-size: 0.85rem;
    font-weight: 500;
    color: hsla(0, 0%, 100%, 0.72);
    transition: all var(--transition-fast);
    position: relative;
  }

  .sidebar__link:hover {
    background: hsla(0, 0%, 100%, 0.08);
    color: white;
  }

  .sidebar__link.active {
    background: hsla(0, 0%, 100%, 0.14);
    color: white;
  }

  .sidebar__link.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    background: var(--accent-orange);
    border-radius: 0 2px 2px 0;
  }

  .sidebar__link-badge {
    margin-left: auto;
    font-size: 0.65rem;
    color: hsla(0, 0%, 100%, 0.46);
    font-weight: 400;
  }

  .sidebar__source {
    display: flex;
    gap: var(--space-sm);
    margin: 0 var(--space-sm) var(--space-sm);
    padding: 0.65rem 0.75rem;
    border: 1px solid hsla(0, 0%, 100%, 0.12);
    border-radius: var(--radius-md);
    color: hsla(0, 0%, 100%, 0.72);
    font-size: 0.73rem;
    line-height: 1.4;
    background: hsla(0, 0%, 100%, 0.06);
  }

  .sidebar__footer {
    padding: var(--space-md) var(--space-lg);
    border-top: 1px solid hsla(0, 0%, 100%, 0.12);
    font-size: 0.7rem;
    color: hsla(0, 0%, 100%, 0.55);
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .sidebar-toggle {
      display: flex;
    }

    .sidebar-overlay {
      display: block;
    }

    .sidebar {
      transform: translateX(-100%);
      transition: transform var(--transition-slow);
    }

    .sidebar.open {
      transform: translateX(0);
    }
  }
</style>
