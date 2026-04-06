import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { updateTaskFolderApi, tasksKeys } from '@/features/tasks/api/tasks.api';
import type { UpsertTaskFolderPayload } from '@/features/tasks/types/tasks.types';
import type { ID } from '@/shared/types/common';

export function useUpdateTaskFolderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: ID; payload: UpsertTaskFolderPayload }) =>
      updateTaskFolderApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.folders() });
    },
  });
}
