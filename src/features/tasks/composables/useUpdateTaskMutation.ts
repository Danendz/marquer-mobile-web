import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { updateTaskApi, tasksKeys } from '@/features/tasks/api/tasks.api';
import type { UpdateTaskPayload } from '@/features/tasks/types/tasks.types';
import type { ID } from '@/shared/types/common';

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: ID; payload: UpdateTaskPayload }) =>
      updateTaskApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.lists() });
    },
  });
}
