import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { deleteNoteApi, notesKeys } from '@/features/notes/api/notes.api';

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNoteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    },
  });
}
