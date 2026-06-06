<script>
  // @ts-nocheck
  import { goto } from '$app/navigation';
  import { ShieldCheck, UserCog, Users, Eye, EyeOff, LogIn } from '@lucide/svelte';
  import { HARD_CODED_USERS, authenticateHardcodedUser } from '$lib/auth/hardcodedUsers.js';
  import { loginSession } from '$lib/stores/auth.js';

  const roleIcons = {
    super_admin: ShieldCheck,
    admin: UserCog,
    user: Users,
  };

  let selectedRole = $state('super_admin');
  let username = $state('superadmin');
  let password = $state('superadmin123');
  let showPassword = $state(false);
  let errorMessage = $state('');

  const selectedUser = $derived(HARD_CODED_USERS.find((user) => user.role === selectedRole));

  function chooseRole(user) {
    selectedRole = user.role;
    username = user.username;
    password = user.password;
    errorMessage = '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const user = authenticateHardcodedUser(username.trim(), password, selectedRole);

    if (!user) {
      errorMessage = 'Username, password, atau role tidak sesuai.';
      return;
    }

    loginSession(user);
    await goto('/');
  }
</script>

<svelte:head>
  <title>Login — RIO Kemendagri</title>
</svelte:head>

<main class="login-page">
  <section class="login-hero" aria-label="Identitas aplikasi">
    <div class="login-hero__brand">
      <img src="/logo.svg" alt="Logo Kementerian" />
      <div>
        <span>Kementerian Dalam Negeri</span>
        <strong>Republik Indonesia</strong>
      </div>
    </div>

    <div class="login-hero__content">
      <span class="login-hero__label">RIO Data Wilayah Nasional</span>
      <h1>Sistem pemantauan potensi dan administrasi kecamatan Indonesia.</h1>
      <p>
        Portal internal berbasis data wilayah untuk mendukung pemantauan nasional,
        koordinasi daerah, dan pembacaan indikator pemerintahan.
      </p>
    </div>

    <div class="login-hero__stats">
      <div>
        <strong>7.285</strong>
        <span>Kecamatan</span>
      </div>
      <div>
        <strong>514</strong>
        <span>Kab/Kota</span>
      </div>
      <div>
        <strong>38</strong>
        <span>Provinsi</span>
      </div>
    </div>
  </section>

  <section class="login-panel" aria-label="Form login">
    <div class="login-panel__header">
      <img src="/logo.svg" alt="Logo Kementerian" />
      <div>
        <span>Akses Sistem</span>
        <h2>Masuk ke Dashboard</h2>
      </div>
    </div>

    <div class="role-grid" aria-label="Pilih role">
      {#each HARD_CODED_USERS as user}
        {@const Icon = roleIcons[user.role]}
        <button
          type="button"
          class="role-card"
          class:active={selectedRole === user.role}
          onclick={() => chooseRole(user)}
        >
          <Icon size={18} />
          <span>{user.roleLabel}</span>
        </button>
      {/each}
    </div>

    <form class="login-form" onsubmit={handleSubmit}>
      <label>
        <span>Role aktif</span>
        <input value={selectedUser?.roleLabel ?? ''} readonly />
      </label>

      <label>
        <span>Username</span>
        <input bind:value={username} autocomplete="username" />
      </label>

      <label>
        <span>Password</span>
        <div class="password-field">
          <input
            bind:value={password}
            type={showPassword ? 'text' : 'password'}
            autocomplete="current-password"
          />
          <button type="button" onclick={() => (showPassword = !showPassword)} aria-label="Toggle password">
            {#if showPassword}
              <EyeOff size={17} />
            {:else}
              <Eye size={17} />
            {/if}
          </button>
        </div>
      </label>

      {#if errorMessage}
        <p class="login-form__error">{errorMessage}</p>
      {/if}

      <button class="login-form__submit" type="submit">
        <LogIn size={18} />
        Masuk
      </button>
    </form>

    <div class="demo-users">
      <span>Akun demo hardcode</span>
      {#each HARD_CODED_USERS as user}
        <button type="button" onclick={() => chooseRole(user)}>
          <strong>{user.roleLabel}</strong>
          <small>{user.username} / {user.password}</small>
        </button>
      {/each}
    </div>
  </section>
</main>

<style>
  .login-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: minmax(0, 1.05fr) minmax(420px, 0.95fr);
    background:
      linear-gradient(135deg, hsla(151, 72%, 27%, 0.92), hsla(212, 67%, 19%, 0.96)),
      radial-gradient(circle at 20% 20%, hsla(44, 96%, 55%, 0.38), transparent 38%);
  }

  .login-hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: clamp(2rem, 5vw, 4.5rem);
    color: white;
    position: relative;
    overflow: hidden;
  }

  .login-hero::after {
    content: '';
    position: absolute;
    right: -120px;
    bottom: -120px;
    width: 360px;
    height: 360px;
    border: 42px solid hsla(44, 96%, 55%, 0.2);
    border-radius: 50%;
  }

  .login-hero__brand {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    position: relative;
    z-index: 1;
  }

  .login-hero__brand img,
  .login-panel__header img {
    width: 62px;
    height: 78px;
    object-fit: contain;
  }

  .login-hero__brand div,
  .login-panel__header div {
    display: flex;
    flex-direction: column;
  }

  .login-hero__brand span {
    color: hsla(0, 0%, 100%, 0.74);
    font-size: 0.9rem;
    font-weight: 600;
  }

  .login-hero__brand strong {
    font-size: 1.1rem;
  }

  .login-hero__content {
    max-width: 680px;
    position: relative;
    z-index: 1;
  }

  .login-hero__label {
    display: inline-flex;
    color: hsl(44, 96%, 72%);
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: var(--space-md);
  }

  .login-hero__content h1 {
    font-size: clamp(2.2rem, 5vw, 4.2rem);
    line-height: 1.03;
    max-width: 760px;
  }

  .login-hero__content p {
    color: hsla(0, 0%, 100%, 0.78);
    font-size: 1rem;
    max-width: 610px;
    margin-top: var(--space-lg);
  }

  .login-hero__stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-md);
    position: relative;
    z-index: 1;
  }

  .login-hero__stats div {
    padding: var(--space-md);
    border: 1px solid hsla(0, 0%, 100%, 0.18);
    border-radius: var(--radius-lg);
    background: hsla(0, 0%, 100%, 0.1);
  }

  .login-hero__stats strong,
  .login-hero__stats span {
    display: block;
  }

  .login-hero__stats strong {
    font-size: 1.55rem;
  }

  .login-hero__stats span {
    color: hsla(0, 0%, 100%, 0.72);
    font-size: 0.78rem;
  }

  .login-panel {
    align-self: center;
    width: min(520px, calc(100% - 2rem));
    margin: var(--space-xl) auto;
    padding: clamp(1.5rem, 4vw, 2.25rem);
    border: 1px solid hsla(0, 0%, 100%, 0.65);
    border-radius: var(--radius-xl);
    background: hsla(0, 0%, 100%, 0.94);
    box-shadow: 0 24px 60px hsla(212, 60%, 12%, 0.22);
  }

  .login-panel__header {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .login-panel__header span {
    color: var(--accent-green);
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .login-panel__header h2 {
    color: var(--accent-navy);
    font-size: 1.55rem;
  }

  .role-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .role-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    min-height: 76px;
    padding: 0.8rem 0.5rem;
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-lg);
    background: white;
    color: var(--text-secondary);
    font-size: 0.78rem;
    font-weight: 800;
    transition: border-color var(--transition-fast), background var(--transition-fast), color var(--transition-fast), box-shadow var(--transition-fast);
  }

  .role-card.active {
    border-color: hsl(44, 96%, 55%);
    background: linear-gradient(180deg, hsl(48, 100%, 96%), white);
    color: var(--accent-navy);
    box-shadow: 0 10px 24px hsla(44, 96%, 45%, 0.15);
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .login-form label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .login-form label > span {
    color: var(--text-secondary);
    font-size: 0.78rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .login-form input {
    width: 100%;
    min-height: 46px;
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-md);
    background: white;
    color: var(--text-primary);
    font: inherit;
    font-size: 0.9rem;
    padding: 0 0.9rem;
    outline: none;
  }

  .login-form input:focus {
    border-color: var(--accent-green);
    box-shadow: 0 0 0 3px var(--accent-green-soft);
  }

  .password-field {
    display: flex;
    align-items: center;
    border: 1px solid var(--border-glass);
    border-radius: var(--radius-md);
    background: white;
  }

  .password-field:focus-within {
    border-color: var(--accent-green);
    box-shadow: 0 0 0 3px var(--accent-green-soft);
  }

  .password-field input {
    border: 0;
    box-shadow: none;
  }

  .password-field button {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    color: var(--text-muted);
  }

  .login-form__error {
    color: var(--accent-rose);
    font-size: 0.82rem;
    font-weight: 700;
  }

  .login-form__submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    min-height: 48px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, var(--accent-green), hsl(151, 66%, 22%));
    color: white;
    font-weight: 800;
    box-shadow: 0 14px 30px hsla(151, 72%, 27%, 0.24);
  }

  .demo-users {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    margin-top: var(--space-lg);
    padding-top: var(--space-lg);
    border-top: 1px solid var(--border-glass);
  }

  .demo-users > span {
    color: var(--text-muted);
    font-size: 0.74rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .demo-users button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-md);
    padding: 0.55rem 0;
    color: var(--text-secondary);
    text-align: left;
  }

  .demo-users strong {
    color: var(--text-primary);
    font-size: 0.82rem;
  }

  .demo-users small {
    color: var(--text-muted);
    font-size: 0.76rem;
  }

  @media (max-width: 920px) {
    .login-page {
      grid-template-columns: 1fr;
    }

    .login-hero {
      min-height: auto;
      gap: var(--space-2xl);
    }

    .login-panel {
      margin-top: 0;
    }
  }

  @media (max-width: 540px) {
    .login-hero {
      padding: 1.5rem;
    }

    .login-hero__stats,
    .role-grid {
      grid-template-columns: 1fr;
    }

    .demo-users button {
      align-items: flex-start;
      flex-direction: column;
      gap: 0;
    }
  }
</style>
