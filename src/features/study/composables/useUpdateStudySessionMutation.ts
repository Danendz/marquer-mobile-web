import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { updateStudySessionApi, studyKeys } from '@/features/study/api/study.api';
import type { ID } from '@/shared/types/common';

export function useUpdateStudySessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: ID; payload: Record<string, unknown> }) =>
      updateStudySessionApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studyKeys.sessions() });
    },
  });
}
