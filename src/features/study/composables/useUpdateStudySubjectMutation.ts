import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { updateStudySubjectApi, studyKeys } from '@/features/study/api/study.api';
import type { UpsertStudySubjectPayload } from '@/features/study/types/study.types';
import type { ID } from '@/shared/types/common';

export function useUpdateStudySubjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: ID; payload: UpsertStudySubjectPayload }) =>
      updateStudySubjectApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studyKeys.subjects() });
    },
  });
}
