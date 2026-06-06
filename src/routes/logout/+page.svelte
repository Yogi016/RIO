<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { logoutSession } from '$lib/stores/auth.js';

  onMount(() => {
    logoutSession();
    goto('/login');
  });
</script>

<svelte:head>
  <title>Keluar — RIO Kemendagri</title>
</svelte:head>

<main class="logout-page">
  <img src="/logo.svg" alt="Logo Kementerian" />
  <p>Mengakhiri sesi...</p>
</main>

<style>
  .logout-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    gap: var(--space-md);
    align-content: center;
    background: linear-gradient(135deg, var(--accent-green), var(--accent-navy));
    color: white;
    font-weight: 800;
  }

  .logout-page img {
    width: 74px;
    height: 96px;
    object-fit: contain;
    padding: 0.6rem;
    border-radius: var(--radius-lg);
    background: white;
    box-shadow: 0 18px 40px hsla(0, 0%, 0%, 0.2);
  }
</style>
