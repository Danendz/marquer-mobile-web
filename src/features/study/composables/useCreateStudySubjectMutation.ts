import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { createStudySubjectApi, studyKeys } from '@/features/study/api/study.api';

export function useCreateStudySubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudySubjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studyKeys.subjects() });
    },
  });
}
