import { useQuery } from '@tanstack/vue-query';
import { authKeys, fetchMeApi } from '@/features/auth/api/auth.api';
import { STALE_TIME } from '@/shared/constants/query';

export function useMeQuery() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const response = await fetchMeApi();
      return response.data;
    },
    staleTime: STALE_TIME.INFINITE,
  });
}
