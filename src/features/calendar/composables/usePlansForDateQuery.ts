import { useQuery } from '@tanstack/vue-query';
import type { MaybeRefOrGetter } from 'vue';
import { toValue } from 'vue';
import { calendarKeys, getPlansForDateApi } from '@/features/calendar/api/calendar.api';
import { STALE_TIME } from '@/shared/constants/query';

export function usePlansForDateQuery(date: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: calendarKeys.plansForDate(toValue(date)),
    queryFn: async () => {
      const response = await getPlansForDateApi(toValue(date));
      return response.data;
    },
    staleTime: STALE_TIME.SHORT,
  });
}
