import { useQuery } from '@tanstack/vue-query';
import { notesKeys, getNotesApi } from '@/features/notes/api/notes.api';
import { STALE_TIME } from '@/shared/constants/query';

export function useNotesQuery() {
  return useQuery({
    queryKey: notesKeys.lists(),
    queryFn: async () => {
      const response = await getNotesApi();
      return response.data;
    },
    staleTime: STALE_TIME.MEDIUM,
  });
}
