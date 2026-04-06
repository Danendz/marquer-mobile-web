import { useQuery } from '@tanstack/vue-query';
import type { MaybeRefOrGetter } from 'vue';
import { toValue } from 'vue';
import { calendarKeys, getWeekDataApi } from '@/features/calendar/api/calendar.api';
import { STALE_TIME } from '@/shared/constants/query';

export function useWeekDataQuery(from: MaybeRefOrGetter<string>, to: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: calendarKeys.week(toValue(from), toValue(to)),
    queryFn: async () => {
      const response = await getWeekDataApi(toValue(from), toValue(to));
      return response.data;
    },
    staleTime: STALE_TIME.SHORT,
  });
}
