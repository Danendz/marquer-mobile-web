import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { completeStudySessionApi, studyKeys } from '@/features/study/api/study.api';
import type { CompleteStudySessionPayload } from '@/features/study/types/study.types';
import type { ID } from '@/shared/types/common';

export function useCompleteStudySessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: ID; payload: CompleteStudySessionPayload }) =>
      completeStudySessionApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studyKeys.sessions() });
      queryClient.invalidateQueries({ queryKey: studyKeys.stats() });
    },
  });
}
