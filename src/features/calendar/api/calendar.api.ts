import { apiClient } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/api/types';
import type { ID } from '@/shared/types/common';
import type {
  Plan,
  CreatePlanPayload,
  UpdatePlanPayload,
  PlanForDate,
  Countdown,
  CreateCountdownPayload,
  UpdateCountdownPayload,
  CalendarOverview,
  WeekData,
} from '@/features/calendar/types/calendar.types';

export const calendarKeys = {
  all: ['calendar'] as const,
  overview: (from: string, to: string) => [...calendarKeys.all, 'overview', from, to] as const,
  week: (from: string, to: string) => [...calendarKeys.all, 'week', from, to] as const,
  countdowns: () => [...calendarKeys.all, 'countdowns'] as const,
  plans: () => [...calendarKeys.all, 'plans'] as const,
  plansForDate: (date: string) => [...calendarKeys.all, 'plans-for-date', date] as const,
};

// --- Overview & Week ---

export async function getCalendarOverviewApi(
  from: string,
  to: string,
): Promise<ApiResponse<CalendarOverview>> {
  const { data } = await apiClient.get('/calendar/overview', { params: { from, to } });
  return data;
}

export async function getWeekDataApi(from: string, to: string): Promise<ApiResponse<WeekData>> {
  const { data } = await apiClient.get('/calendar/week', { params: { from, to } });
  return data;
}

// --- Countdowns ---

export async function getCountdownsApi(): Promise<ApiResponse<Countdown[]>> {
  const { data } = await apiClient.get('/calendar/countdowns');
  return data;
}

export async function createCountdownApi(
  payload: CreateCountdownPayload,
): Promise<ApiResponse<Countdown>> {
  const { data } = await apiClient.post('/calendar/countdowns', payload);
  return data;
}

export async function updateCountdownApi(
  id: ID,
  payload: UpdateCountdownPayload,
): Promise<ApiResponse<Countdown>> {
  const { data } = await apiClient.put(`/calendar/countdowns/${id}`, payload);
  return data;
}

export async function deleteCountdownApi(id: ID): Promise<void> {
  await apiClient.delete(`/calendar/countdowns/${id}`);
}

// --- Plans ---

export async function getPlansApi(): Promise<ApiResponse<Plan[]>> {
  const { data } = await apiClient.get('/calendar/plans');
  return data;
}

export async function createPlanApi(payload: CreatePlanPayload): Promise<ApiResponse<Plan>> {
  const { data } = await apiClient.post('/calendar/plans', payload);
  return data;
}

export async function updatePlanApi(id: ID, payload: UpdatePlanPayload): Promise<ApiResponse<Plan>> {
  const { data } = await apiClient.put(`/calendar/plans/${id}`, payload);
  return data;
}

export async function deletePlanApi(id: ID): Promise<void> {
  await apiClient.delete(`/calendar/plans/${id}`);
}

export async function getPlansForDateApi(date: string): Promise<ApiResponse<PlanForDate[]>> {
  const { data } = await apiClient.get('/calendar/plans/for-date', { params: { date } });
  return data;
}

// --- Plan Task Toggle ---

export async function togglePlanTaskCompletionApi(
  planTaskId: ID,
  date: string,
): Promise<ApiResponse<{ is_completed: boolean }>> {
  const { data } = await apiClient.post(`/calendar/plan-tasks/${planTaskId}/toggle`, null, {
    params: { date },
  });
  return data;
}
