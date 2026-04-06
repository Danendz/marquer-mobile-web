import { apiClient } from '@/shared/api/client';
import type { ApiResponse } from '@/shared/api/types';
import type { ID } from '@/shared/types/common';
import type {
  TaskFolder,
  TaskCategory,
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  GetTasksParams,
  UpsertTaskFolderPayload,
  UpsertTaskCategoryPayload,
} from '@/features/tasks/types/tasks.types';

export const tasksKeys = {
  all: ['tasks'] as const,
  lists: () => [...tasksKeys.all, 'list'] as const,
  list: (params?: GetTasksParams) => [...tasksKeys.lists(), params] as const,
  folders: () => [...tasksKeys.all, 'folders'] as const,
};

// --- Folders ---

export async function getTaskFoldersApi(): Promise<ApiResponse<TaskFolder[]>> {
  const { data } = await apiClient.get('/task-folders');
  return data;
}

export async function createTaskFolderApi(
  payload: UpsertTaskFolderPayload,
): Promise<ApiResponse<TaskFolder>> {
  const { data } = await apiClient.post('/task-folders', payload);
  return data;
}

export async function updateTaskFolderApi(
  id: ID,
  payload: UpsertTaskFolderPayload,
): Promise<ApiResponse<TaskFolder>> {
  const { data } = await apiClient.put(`/task-folders/${id}`, payload);
  return data;
}

export async function deleteTaskFolderApi(id: ID): Promise<void> {
  await apiClient.delete(`/task-folders/${id}`);
}

// --- Categories ---

export async function createTaskCategoryApi(
  payload: UpsertTaskCategoryPayload,
): Promise<ApiResponse<TaskCategory>> {
  const { data } = await apiClient.post('/task-categories', payload);
  return data;
}

export async function updateTaskCategoryApi(
  id: ID,
  payload: UpsertTaskCategoryPayload,
): Promise<ApiResponse<TaskCategory>> {
  const { data } = await apiClient.put(`/task-categories/${id}`, payload);
  return data;
}

export async function deleteTaskCategoryApi(id: ID): Promise<void> {
  await apiClient.delete(`/task-categories/${id}`);
}

// --- Tasks ---

export async function getTasksApi(params?: GetTasksParams): Promise<ApiResponse<Task[]>> {
  const { data } = await apiClient.get('/tasks', { params });
  return data;
}

export async function createTaskApi(payload: CreateTaskPayload): Promise<ApiResponse<Task>> {
  const { data } = await apiClient.post('/tasks', payload);
  return data;
}

export async function updateTaskApi(id: ID, payload: UpdateTaskPayload): Promise<ApiResponse<Task>> {
  const { data } = await apiClient.put(`/tasks/${id}`, payload);
  return data;
}

export async function deleteTaskApi(id: ID): Promise<void> {
  await apiClient.delete(`/tasks/${id}`);
}
