import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { createPlanApi, calendarKeys } from '@/features/calendar/api/calendar.api';

export function useCreatePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlanApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.plans() });
    },
  });
}
