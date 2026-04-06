import { useQuery } from '@tanstack/vue-query';
import { tasksKeys, getTaskFoldersApi } from '@/features/tasks/api/tasks.api';
import { STALE_TIME } from '@/shared/constants/query';

export function useTaskFoldersQuery() {
  return useQuery({
    queryKey: tasksKeys.folders(),
    queryFn: async () => {
      const response = await getTaskFoldersApi();
      return response.data;
    },
    staleTime: STALE_TIME.LONG,
  });
}
