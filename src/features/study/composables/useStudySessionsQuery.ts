import { useQuery } from '@tanstack/vue-query';
import type { MaybeRefOrGetter } from 'vue';
import { toValue } from 'vue';
import { studyKeys, getStudySessionsApi } from '@/features/study/api/study.api';
import type { GetStudySessionsParams } from '@/features/study/types/study.types';
import { STALE_TIME } from '@/shared/constants/query';

export function useStudySessionsQuery(params?: MaybeRefOrGetter<GetStudySessionsParams | undefined>) {
  return useQuery({
    queryKey: studyKeys.sessionList(toValue(params)),
    queryFn: async () => {
      const response = await getStudySessionsApi(toValue(params));
      return response.data;
    },
    staleTime: STALE_TIME.SHORT,
  });
}
