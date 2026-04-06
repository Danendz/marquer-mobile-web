import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { deletePlanApi, calendarKeys } from '@/features/calendar/api/calendar.api';

export function useDeletePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlanApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.plans() });
    },
  });
}
