// Placeholder — implement when building login UI
//
// Example pattern:
//
// import { useMutation } from '@tanstack/vue-query';
// import { loginApi } from '@/features/auth/api/auth.api';
// import { useAuthStore } from '@/features/auth/store/auth.store';
//
// export function useLoginMutation() {
//   const authStore = useAuthStore();
//   return useMutation({
//     mutationFn: loginApi,
//     onSuccess: async (response) => {
//       await authStore.setToken(response.data.token);
//     },
//   });
// }
