import { useQuery } from '@tanstack/vue-query';
import { studyKeys, getStudyStatsApi } from '@/features/study/api/study.api';
import { STALE_TIME } from '@/shared/constants/query';

export function useStudyStatsQuery() {
  return useQuery({
    queryKey: studyKeys.stats(),
    queryFn: async () => {
      const response = await getStudyStatsApi();
      return response.data;
    },
    staleTime: STALE_TIME.SHORT,
  });
}
