import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { updateCountdownApi, calendarKeys } from '@/features/calendar/api/calendar.api';
import type { UpdateCountdownPayload } from '@/features/calendar/types/calendar.types';
import type { ID } from '@/shared/types/common';

export function useUpdateCountdownMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: ID; payload: UpdateCountdownPayload }) =>
      updateCountdownApi(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.countdowns() });
    },
  });
}
