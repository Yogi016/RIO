<script>
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import '../app.css';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { authSession } from '$lib/stores/auth.js';

  let { children } = $props();

  const isLoginPage = $derived(page.url.pathname === '/login');
  const isLogoutPage = $derived(page.url.pathname === '/logout');
  const isAuthPage = $derived(isLoginPage || isLogoutPage);

  $effect(() => {
    if (!browser) return;

    if (!$authSession && !isAuthPage) {
      goto('/login');
    }

    if ($authSession && isLoginPage) {
      goto('/');
    }
  });
</script>

<svelte:head>
  <title>RIO — Sistem Potensi Perbatasan Darat</title>
</svelte:head>

<div class:layout={!isAuthPage} class:layout--auth={isAuthPage}>
  {#if !isAuthPage && $authSession}
    <Sidebar session={$authSession} />
  {/if}
  <main class:layout__main={!isAuthPage} class:layout__auth-main={isAuthPage}>
    {@render children()}
  </main>
</div>

<style>
  .layout {
    display: flex;
    min-height: 100vh;
  }

  .layout--auth {
    min-height: 100vh;
  }

  .layout__main {
    flex: 1;
    margin-left: var(--sidebar-width);
    padding: var(--space-xl) var(--space-2xl);
    max-width: 100%;
    overflow-x: hidden;
  }

  .layout__auth-main {
    min-height: 100vh;
  }

  @media (max-width: 768px) {
    .layout__main {
      margin-left: 0;
      padding: var(--space-xl) var(--space-md);
      padding-top: calc(var(--space-xl) + 50px);
    }
  }
</style>
