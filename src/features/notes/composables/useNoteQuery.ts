import { useQuery } from '@tanstack/vue-query';
import type { MaybeRefOrGetter } from 'vue';
import { toValue } from 'vue';
import { notesKeys, getNoteApi } from '@/features/notes/api/notes.api';
import type { ID } from '@/shared/types/common';
import { STALE_TIME } from '@/shared/constants/query';

export function useNoteQuery(id: MaybeRefOrGetter<ID>) {
  return useQuery({
    queryKey: notesKeys.detail(toValue(id)),
    queryFn: async () => {
      const response = await getNoteApi(toValue(id));
      return response.data;
    },
    staleTime: STALE_TIME.MEDIUM,
  });
}
