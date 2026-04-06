import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { createStudySessionApi, studyKeys } from '@/features/study/api/study.api';

export function useCreateStudySessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudySessionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studyKeys.sessions() });
      queryClient.invalidateQueries({ queryKey: studyKeys.stats() });
    },
  });
}
