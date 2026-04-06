import type { ID, Timestamp } from '@/shared/types/common';
import type { Task } from '@/features/tasks/types/tasks.types';

// --- Schedule (discriminated union) ---

export type PlanSchedule =
  | { type: 'daily' }
  | { type: 'weekly'; days: number[] }
  | { type: 'interval'; every: number }
  | { type: 'monthly_dates'; days: number[] }
  | { type: 'monthly_weekday'; week: number; weekday: number };

// --- Plans ---

export interface Plan {
  id: ID;
  name: string;
  schedule: PlanSchedule;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  color?: string;
  tasks: PlanTask[];
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface PlanTask {
  id: ID;
  name: string;
  sort_order: number;
  start_time?: string;
  end_time?: string;
}

export interface CreatePlanPayload {
  name: string;
  schedule: PlanSchedule;
  start_date: string;
  end_date?: string;
  color?: string;
  tasks: CreatePlanTaskPayload[];
}

export interface CreatePlanTaskPayload {
  name: string;
  sort_order: number;
  start_time?: string;
  end_time?: string;
}

export interface UpdatePlanPayload {
  name: string;
  schedule: PlanSchedule;
  start_date: string;
  end_date?: string;
  is_active?: boolean;
  color?: string;
  tasks: UpdatePlanTaskPayload[];
}

export interface UpdatePlanTaskPayload {
  id?: ID;
  name: string;
  sort_order: number;
  start_time?: string;
  end_time?: string;
}

export interface PlanForDate {
  id: ID;
  name: string;
  color?: string;
  tasks: PlanTaskForDate[];
}

export interface PlanTaskForDate {
  id: ID;
  name: string;
  sort_order: number;
  start_time?: string;
  end_time?: string;
  is_completed: boolean;
}

// --- Countdowns ---

export interface Countdown {
  id: ID;
  name: string;
  target_date: string;
  bg_image: string;
  is_pinned: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CreateCountdownPayload {
  name: string;
  target_date: string;
  bg_image: string;
}

export interface UpdateCountdownPayload {
  name?: string;
  target_date?: string;
  is_pinned?: boolean;
  bg_image?: string;
}

// --- Calendar Overview & Week Data ---

export interface CalendarOverview {
  tasks: string[];
  plan_tasks: string[];
}

export interface WeekData {
  tasks: Record<string, Task[]>;
  plan_tasks: Record<string, WeekPlanTask[]>;
  countdowns: Record<string, Countdown[]>;
}

export interface WeekPlanTask {
  id: ID;
  name: string;
  sort_order: number;
  start_time?: string;
  end_time?: string;
  is_completed: boolean;
  plan_id: ID;
  plan_name: string;
  plan_color?: string;
}
