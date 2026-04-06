import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { createCountdownApi, calendarKeys } from '@/features/calendar/api/calendar.api';

export function useCreateCountdownMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCountdownApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.countdowns() });
    },
  });
}
