import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { updateTaskCategoryApi, tasksKeys } from '@/features/tasks/api/tasks.api';
import type { UpsertTaskCategoryPayload } from '@/features/tasks/types/tasks.types';
import type { ID } from '@/shared/types/common';

export function useUpdateTaskCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: ID; payload: UpsertTaskCategoryPayload }) =>
      updateTaskCategoryApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.folders() });
    },
  });
}
