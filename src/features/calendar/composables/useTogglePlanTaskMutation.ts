import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { togglePlanTaskCompletionApi, calendarKeys } from '@/features/calendar/api/calendar.api';
import type { ID } from '@/shared/types/common';

export function useTogglePlanTaskMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planTaskId, date }: { planTaskId: ID; date: string }) =>
      togglePlanTaskCompletionApi(planTaskId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.all });
    },
  });
}
