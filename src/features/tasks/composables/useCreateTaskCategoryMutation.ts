import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { createTaskCategoryApi, tasksKeys } from '@/features/tasks/api/tasks.api';

export function useCreateTaskCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.folders() });
    },
  });
}
