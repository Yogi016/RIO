// @ts-nocheck
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'rio-auth-session';

function readSession() {
  if (!browser) return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export const authSession = writable(readSession());

export function loginSession(user) {
  const session = {
    role: user.role,
    roleLabel: user.roleLabel,
    name: user.name,
    username: user.username,
    scope: user.scope,
    loggedInAt: new Date().toISOString(),
  };

  if (browser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  authSession.set(session);
}

export function logoutSession() {
  if (browser) {
    localStorage.removeItem(STORAGE_KEY);
  }

  authSession.set(null);
}
