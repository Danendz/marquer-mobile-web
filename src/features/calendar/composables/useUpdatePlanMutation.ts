import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { updatePlanApi, calendarKeys } from '@/features/calendar/api/calendar.api';
import type { UpdatePlanPayload } from '@/features/calendar/types/calendar.types';
import type { ID } from '@/shared/types/common';

export function useUpdatePlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: ID; payload: UpdatePlanPayload }) =>
      updatePlanApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.plans() });
    },
  });
}
