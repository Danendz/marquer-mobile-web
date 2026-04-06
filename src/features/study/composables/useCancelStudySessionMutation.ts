import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { cancelStudySessionApi, studyKeys } from '@/features/study/api/study.api';

export function useCancelStudySessionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelStudySessionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studyKeys.sessions() });
      queryClient.invalidateQueries({ queryKey: studyKeys.stats() });
    },
  });
}
