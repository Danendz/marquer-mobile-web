import { useQuery } from '@tanstack/vue-query';
import type { MaybeRefOrGetter } from 'vue';
import { toValue } from 'vue';
import { tasksKeys, getTasksApi } from '@/features/tasks/api/tasks.api';
import type { GetTasksParams } from '@/features/tasks/types/tasks.types';
import { STALE_TIME } from '@/shared/constants/query';

export function useTasksQuery(params?: MaybeRefOrGetter<GetTasksParams | undefined>) {
  return useQuery({
    queryKey: tasksKeys.list(toValue(params)),
    queryFn: async () => {
      const response = await getTasksApi(toValue(params));
      return response.data;
    },
    staleTime: STALE_TIME.MEDIUM,
  });
}
