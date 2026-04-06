import { apiClient } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/api/types';
import type { ID } from '@/shared/types/common';
import type {
  Note,
  ListNote,
  CreateNotePayload,
  UpdateNotePayload,
} from '@/features/notes/types/notes.types';

export const notesKeys = {
  all: ['notes'] as const,
  lists: () => [...notesKeys.all, 'list'] as const,
  details: () => [...notesKeys.all, 'detail'] as const,
  detail: (id: ID) => [...notesKeys.details(), id] as const,
};

export async function getNotesApi(): Promise<ApiResponse<ListNote[]>> {
  const { data } = await apiClient.get('/notes');
  return data;
}

export async function getNoteApi(id: ID): Promise<ApiResponse<Note>> {
  const { data } = await apiClient.get(`/notes/${id}`);
  return data;
}

export async function createNoteApi(payload: CreateNotePayload): Promise<ApiResponse<Note>> {
  const { data } = await apiClient.post('/notes', payload);
  return data;
}

export async function updateNoteApi(id: ID, payload: UpdateNotePayload): Promise<ApiResponse<Note>> {
  const { data } = await apiClient.put(`/notes/${id}`, payload);
  return data;
}

export async function deleteNoteApi(id: ID): Promise<void> {
  await apiClient.delete(`/notes/${id}`);
}
