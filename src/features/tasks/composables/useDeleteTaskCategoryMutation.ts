import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { deleteTaskCategoryApi, tasksKeys } from '@/features/tasks/api/tasks.api';

export function useDeleteTaskCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTaskCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.folders() });
    },
  });
}
