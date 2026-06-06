<script>
  import { page } from '$app/state';
  import { kecamatanList } from '$lib/stores/kecamatan.js';
  import { MapPin, LayoutDashboard, Menu, X, Database, LogOut, ShieldCheck } from '@lucide/svelte';

  let { session = null } = $props();

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
      <img src="/logo.svg" alt="Logo Kementerian" />
    </div>
    <div class="sidebar__brand-text">
      <span class="sidebar__title">RIO Kemendagri</span>
      <span class="sidebar__subtitle">Portal Statistik Wilayah Nasional</span>
    </div>
  </a>

  {#if session}
    <div class="sidebar__user">
      <div class="sidebar__user-icon">
        <ShieldCheck size={18} />
      </div>
      <div>
        <strong>{session.name}</strong>
        <span>{session.roleLabel} • {session.scope}</span>
      </div>
      <a href="/logout" class="sidebar__user-logout" onclick={closeMobile} aria-label="Keluar">
        <LogOut size={15} />
      </a>
    </div>
  {/if}

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
    <a href="/logout" class="sidebar__logout" onclick={closeMobile}>
      <LogOut size={15} />
      <span>Keluar</span>
    </a>
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
    background:
      linear-gradient(180deg, hsla(151, 72%, 20%, 0.96) 0%, hsla(214, 58%, 17%, 0.98) 58%, hsl(214, 67%, 13%) 100%),
      linear-gradient(135deg, hsla(44, 96%, 55%, 0.24), transparent 44%);
    border-right: 1px solid var(--border-glass);
    display: flex;
    flex-direction: column;
    z-index: 1000;
    overflow-y: auto;
  }

  .sidebar__brand {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-lg) var(--space-lg);
    border-bottom: 1px solid hsla(0, 0%, 100%, 0.12);
    color: white;
  }

  .sidebar__logo {
    width: 48px;
    height: 58px;
    border-radius: var(--radius-md);
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-navy);
    flex-shrink: 0;
    box-shadow: 0 10px 22px hsla(0, 0%, 0%, 0.18);
  }

  .sidebar__logo img {
    width: 36px;
    height: 46px;
    object-fit: contain;
  }

  .sidebar__brand-text {
    display: flex;
    flex-direction: column;
  }

  .sidebar__title {
    font-size: 1.05rem;
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

  .sidebar__user {
    display: flex;
    gap: var(--space-sm);
    margin: var(--space-md) var(--space-lg) 0;
    padding: 0.75rem;
    border: 1px solid hsla(0, 0%, 100%, 0.14);
    border-radius: var(--radius-lg);
    background: hsla(0, 0%, 100%, 0.08);
    color: white;
    position: relative;
  }

  .sidebar__user-icon {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: var(--radius-sm);
    background: hsla(44, 96%, 55%, 0.2);
    color: hsl(44, 96%, 72%);
    flex-shrink: 0;
  }

  .sidebar__user div {
    min-width: 0;
    padding-right: 2rem;
  }

  .sidebar__user strong,
  .sidebar__user span {
    display: block;
  }

  .sidebar__user strong {
    font-size: 0.82rem;
    line-height: 1.25;
  }

  .sidebar__user span {
    color: hsla(0, 0%, 100%, 0.64);
    font-size: 0.68rem;
    line-height: 1.35;
    margin-top: 2px;
  }

  .sidebar__user-logout {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border: 1px solid hsla(0, 0%, 100%, 0.16);
    border-radius: var(--radius-sm);
    color: hsla(0, 0%, 100%, 0.78);
    background: hsla(0, 0%, 100%, 0.08);
  }

  .sidebar__user-logout:hover {
    color: white;
    background: hsla(44, 96%, 55%, 0.18);
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
    background: hsl(44, 96%, 55%);
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

  .sidebar__logout {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    width: 100%;
    margin-top: var(--space-md);
    padding: 0.58rem 0.7rem;
    border: 1px solid hsla(0, 0%, 100%, 0.14);
    border-radius: var(--radius-md);
    background: hsla(0, 0%, 100%, 0.08);
    color: white;
    font-size: 0.78rem;
    font-weight: 800;
  }

  .sidebar__logout:hover {
    background: hsla(44, 96%, 55%, 0.16);
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
