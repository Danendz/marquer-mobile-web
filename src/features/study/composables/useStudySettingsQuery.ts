import { useQuery } from '@tanstack/vue-query';
import { studyKeys, getStudySettingsApi } from '@/features/study/api/study.api';
import { STALE_TIME } from '@/shared/constants/query';

export function useStudySettingsQuery() {
  return useQuery({
    queryKey: studyKeys.settings(),
    queryFn: async () => {
      const response = await getStudySettingsApi();
      return response.data;
    },
    staleTime: STALE_TIME.LONG,
  });
}
