import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { deleteTaskApi, tasksKeys } from '@/features/tasks/api/tasks.api';

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTaskApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
    },
  });
}
