import { useQuery } from '@tanstack/vue-query';
import { studyKeys, getStudySubjectsApi } from '@/features/study/api/study.api';
import { STALE_TIME } from '@/shared/constants/query';

export function useStudySubjectsQuery() {
  return useQuery({
    queryKey: studyKeys.subjects(),
    queryFn: async () => {
      const response = await getStudySubjectsApi();
      return response.data;
    },
    staleTime: STALE_TIME.LONG,
  });
}
