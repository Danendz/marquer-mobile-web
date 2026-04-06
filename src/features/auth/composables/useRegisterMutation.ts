import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { registerApi, fetchMeApi, authKeys } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useRegisterMutation() {
  const authStore = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerApi,
    onSuccess: async (response) => {
      await authStore.setToken(response.data.token);
      const me = await fetchMeApi();
      authStore.setUser(me.data);
      queryClient.setQueryData(authKeys.me(), me.data);
    },
  });
}
