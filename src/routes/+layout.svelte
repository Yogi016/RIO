<script>
  import '../app.css';
  import Sidebar from '$lib/components/Sidebar.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <title>RIO — Sistem Potensi Perbatasan Darat</title>
</svelte:head>

<div class="layout">
  <Sidebar />
  <main class="layout__main">
    {@render children()}
  </main>
</div>

<style>
  .layout {
    display: flex;
    min-height: 100vh;
  }

  .layout__main {
    flex: 1;
    margin-left: var(--sidebar-width);
    padding: var(--space-xl) var(--space-2xl);
    max-width: 100%;
    overflow-x: hidden;
  }

  @media (max-width: 768px) {
    .layout__main {
      margin-left: 0;
      padding: var(--space-xl) var(--space-md);
      padding-top: calc(var(--space-xl) + 50px);
    }
  }
</style>
