import type { ID, Timestamp } from '@/shared/types/common';

export interface Note {
  id: ID;
  title: string;
  content: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface ListNote {
  id: ID;
  title: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CreateNotePayload {
  title: string;
  content: string;
}

export interface UpdateNotePayload {
  content: string;
}
