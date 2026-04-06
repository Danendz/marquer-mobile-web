import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { deleteCountdownApi, calendarKeys } from '@/features/calendar/api/calendar.api';

export function useDeleteCountdownMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCountdownApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.countdowns() });
    },
  });
}
