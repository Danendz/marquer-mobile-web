import { apiClient } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/api/types';
import type { ID } from '@/shared/types/common';
import type {
  StudySubject,
  UpsertStudySubjectPayload,
  StudySession,
  StoreStudySessionPayload,
  CompleteStudySessionPayload,
  GetStudySessionsParams,
  StudyStats,
  UserStudySettings,
} from '@/features/study/types/study.types';

export const studyKeys = {
  all: ['study'] as const,
  subjects: () => [...studyKeys.all, 'subjects'] as const,
  sessions: () => [...studyKeys.all, 'sessions'] as const,
  sessionList: (params?: GetStudySessionsParams) => [...studyKeys.sessions(), params] as const,
  stats: () => [...studyKeys.all, 'stats'] as const,
  settings: () => [...studyKeys.all, 'settings'] as const,
};

// --- Subjects ---

export async function getStudySubjectsApi(): Promise<ApiResponse<StudySubject[]>> {
  const { data } = await apiClient.get('/study/subjects');
  return data;
}

export async function createStudySubjectApi(
  payload: UpsertStudySubjectPayload,
): Promise<ApiResponse<StudySubject>> {
  const { data } = await apiClient.post('/study/subjects', payload);
  return data;
}

export async function updateStudySubjectApi(
  id: ID,
  payload: UpsertStudySubjectPayload,
): Promise<ApiResponse<StudySubject>> {
  const { data } = await apiClient.put(`/study/subjects/${id}`, payload);
  return data;
}

export async function deleteStudySubjectApi(id: ID): Promise<void> {
  await apiClient.delete(`/study/subjects/${id}`);
}

// --- Sessions ---

export async function getStudySessionsApi(
  params?: GetStudySessionsParams,
): Promise<ApiResponse<StudySession[]>> {
  const { data } = await apiClient.get('/study/sessions', { params });
  return data;
}

export async function createStudySessionApi(
  payload: StoreStudySessionPayload,
): Promise<ApiResponse<StudySession>> {
  const { data } = await apiClient.post('/study/sessions', payload);
  return data;
}

export async function updateStudySessionApi(
  id: ID,
  payload: Record<string, unknown>,
): Promise<ApiResponse<StudySession>> {
  const { data } = await apiClient.put(`/study/sessions/${id}`, payload);
  return data;
}

export async function completeStudySessionApi(
  id: ID,
  payload: CompleteStudySessionPayload,
): Promise<ApiResponse<StudySession>> {
  const { data } = await apiClient.post(`/study/sessions/${id}/complete`, payload);
  return data;
}

export async function cancelStudySessionApi(id: ID): Promise<ApiResponse<StudySession>> {
  const { data } = await apiClient.post(`/study/sessions/${id}/cancel`, {});
  return data;
}

// --- Stats & Settings ---

export async function getStudyStatsApi(): Promise<ApiResponse<StudyStats>> {
  const { data } = await apiClient.get('/study/sessions/stats');
  return data;
}

export async function getStudySettingsApi(): Promise<ApiResponse<UserStudySettings>> {
  const { data } = await apiClient.get('/study/settings');
  return data;
}

export async function upsertStudySettingsApi(
  settings: UserStudySettings,
): Promise<ApiResponse<UserStudySettings>> {
  const { data } = await apiClient.put('/study/settings', settings);
  return data;
}
