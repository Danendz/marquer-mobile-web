import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { upsertStudySettingsApi, studyKeys } from '@/features/study/api/study.api';

export function useUpsertStudySettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertStudySettingsApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studyKeys.settings() });
    },
  });
}
