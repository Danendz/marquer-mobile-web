import type { NavigationGuardWithThis, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const PUBLIC_ROUTES = new Set<string>([ROUTE_NAMES.LOGIN, ROUTE_NAMES.REGISTER]);

export const authGuard: NavigationGuardWithThis<undefined> = async (
  to: RouteLocationNormalized,
) => {
  const authStore = useAuthStore();

  // Wait for auth state to resolve before making any decision
  if (authStore.isLoading) {
    await authStore.loadFromStorage();
  }

  const isPublic = PUBLIC_ROUTES.has(to.name as string);

  if (!authStore.isAuthenticated && !isPublic) {
    return { name: ROUTE_NAMES.LOGIN };
  }

  if (authStore.isAuthenticated && isPublic) {
    return { name: ROUTE_NAMES.HOME };
  }

  return true;
};
