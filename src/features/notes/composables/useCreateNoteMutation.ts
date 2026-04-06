import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { createNoteApi, notesKeys } from '@/features/notes/api/notes.api';

export function useCreateNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNoteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
}
