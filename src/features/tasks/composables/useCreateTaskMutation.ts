import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { createTaskApi, tasksKeys } from '@/features/tasks/api/tasks.api';

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
    },
  });
}
