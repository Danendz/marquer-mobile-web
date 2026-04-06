import type { ID, Timestamp } from '@/shared/types/common';

export enum TaskStatus {
  Draft = 'draft',
  Progress = 'progress',
  Done = 'done',
  Cancelled = 'cancelled',
}

export interface TaskFolder {
  id: ID;
  name: string;
  categories: TaskCategory[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface TaskCategory {
  id?: ID;
  name: string;
  color: string;
  tasks_count: number;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

export interface Task {
  id: ID;
  name: string;
  status: TaskStatus;
  date?: string;
  start_time?: string;
  end_time?: string;
  task_category_id?: ID;
  color?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CreateTaskPayload {
  name: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  task_category_id?: ID;
  color?: string;
}

export interface UpdateTaskPayload {
  name?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  task_category_id?: ID;
  status?: TaskStatus;
  clear_start_time?: boolean;
  clear_end_time?: boolean;
  color?: string;
  clear_color?: boolean;
}

export interface GetTasksParams {
  task_category_id?: ID;
  task_folder_id?: ID;
  status?: TaskStatus;
  date?: string;
}

export interface UpsertTaskFolderPayload {
  name: string;
}

export interface UpsertTaskCategoryPayload {
  name: string;
  task_folder_id: ID;
  color?: string;
}
