import { useQuery } from '@tanstack/vue-query';
import { calendarKeys, getPlansApi } from '@/features/calendar/api/calendar.api';
import { STALE_TIME } from '@/shared/constants/query';

export function usePlansQuery() {
  return useQuery({
    queryKey: calendarKeys.plans(),
    queryFn: async () => {
      const response = await getPlansApi();
      return response.data;
    },
    staleTime: STALE_TIME.MEDIUM,
  });
}
