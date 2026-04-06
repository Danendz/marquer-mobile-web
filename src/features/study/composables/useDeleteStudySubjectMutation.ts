import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { deleteStudySubjectApi, studyKeys } from '@/features/study/api/study.api';

export function useDeleteStudySubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudySubjectApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studyKeys.subjects() });
    },
  });
}
