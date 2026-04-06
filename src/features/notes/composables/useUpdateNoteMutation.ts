import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { updateNoteApi, notesKeys } from '@/features/notes/api/notes.api';
import type { UpdateNotePayload } from '@/features/notes/types/notes.types';
import type { ID } from '@/shared/types/common';

export function useUpdateNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: ID; payload: UpdateNotePayload }) =>
      updateNoteApi(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notesKeys.detail(id) });
    },
  });
}
