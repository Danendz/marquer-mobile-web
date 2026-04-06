import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { createTaskFolderApi, tasksKeys } from '@/features/tasks/api/tasks.api';

export function useCreateTaskFolderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTaskFolderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.folders() });
    },
  });
}
