import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AuthStatus } from '@/features/auth/types/auth.types';
import type { User } from '@/features/auth/types/auth.types';
import { storage } from '@/shared/utils/storage';
import { fetchMeApi } from '@/features/auth/api/auth.api';

const TOKEN_KEY = 'access_token';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const user = ref<User | null>(null);
  const status = ref<AuthStatus>(AuthStatus.Unknown);

  const isAuthenticated = computed(() => status.value === AuthStatus.Authenticated);
  const isLoading = computed(() => status.value === AuthStatus.Unknown);

  let initPromise: Promise<void> | null = null;

  function loadFromStorage(): Promise<void> {
    if (!initPromise) {
      initPromise = doLoadFromStorage();
    }
    return initPromise;
  }

  async function doLoadFromStorage(): Promise<void> {
    const stored = await storage.get(TOKEN_KEY);
    if (!stored) {
      status.value = AuthStatus.Unauthenticated;
      return;
    }

    token.value = stored;
    try {
      const response = await fetchMeApi();
      user.value = response.data;
      status.value = AuthStatus.Authenticated;
    } catch {
      token.value = null;
      await storage.remove(TOKEN_KEY);
      status.value = AuthStatus.Unauthenticated;
    }
  }

  async function setToken(newToken: string): Promise<void> {
    token.value = newToken;
    await storage.set(TOKEN_KEY, newToken);
    status.value = AuthStatus.Authenticated;
  }

  function setUser(newUser: User): void {
    user.value = newUser;
  }

  async function logout(): Promise<void> {
    token.value = null;
    user.value = null;
    await storage.remove(TOKEN_KEY);
    status.value = AuthStatus.Unauthenticated;
  }

  return { token, user, status, isAuthenticated, isLoading, loadFromStorage, setToken, setUser, logout };
});
