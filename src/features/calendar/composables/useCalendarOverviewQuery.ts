import { useQuery } from '@tanstack/vue-query';
import type { MaybeRefOrGetter } from 'vue';
import { toValue } from 'vue';
import { calendarKeys, getCalendarOverviewApi } from '@/features/calendar/api/calendar.api';
import { STALE_TIME } from '@/shared/constants/query';

export function useCalendarOverviewQuery(
  from: MaybeRefOrGetter<string>,
  to: MaybeRefOrGetter<string>,
) {
  return useQuery({
    queryKey: calendarKeys.overview(toValue(from), toValue(to)),
    queryFn: async () => {
      const response = await getCalendarOverviewApi(toValue(from), toValue(to));
      return response.data;
    },
    staleTime: STALE_TIME.SHORT,
  });
}
