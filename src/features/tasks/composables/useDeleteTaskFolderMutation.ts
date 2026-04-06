import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { deleteTaskFolderApi, tasksKeys } from '@/features/tasks/api/tasks.api';

export function useDeleteTaskFolderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTaskFolderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.folders() });
    },
  });
}
