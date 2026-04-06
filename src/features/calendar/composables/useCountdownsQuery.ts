import { useQuery } from '@tanstack/vue-query';
import { calendarKeys, getCountdownsApi } from '@/features/calendar/api/calendar.api';
import { STALE_TIME } from '@/shared/constants/query';

export function useCountdownsQuery() {
  return useQuery({
    queryKey: calendarKeys.countdowns(),
    queryFn: async () => {
      const response = await getCountdownsApi();
      return response.data;
    },
    staleTime: STALE_TIME.LONG,
  });
}
