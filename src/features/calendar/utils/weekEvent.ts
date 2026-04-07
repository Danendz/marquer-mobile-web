import type { Task } from '@/features/tasks/types/tasks.types';
import { TaskStatus } from '@/features/tasks/types/tasks.types';
import type { Countdown, WeekPlanTask } from '@/features/calendar/types/calendar.types';
import { formatTimeRange } from '@/shared/utils/date';

// --- Discriminated union for week view events ---

interface BaseWeekEvent {
  name: string;
  startTime: string | undefined;
  endTime: string | undefined;
  color: string;
  isDone: boolean;
  isAllDay: boolean;
  startMinutes: number;
  endMinutes: number;
  durationMinutes: number;
  timeRange: string;
}

export interface TaskWeekEvent extends BaseWeekEvent {
  type: 'task';
  task: Task;
}

export interface PlanTaskWeekEvent extends BaseWeekEvent {
  type: 'planTask';
  planTask: WeekPlanTask;
  date: string;
  planId: number;
  planName: string;
}

export interface CountdownWeekEvent extends BaseWeekEvent {
  type: 'countdown';
  countdown: Countdown;
}

export type WeekEvent = TaskWeekEvent | PlanTaskWeekEvent | CountdownWeekEvent;

// --- Helpers ---

export function parseTimeToMinutes(time: string): number {
  const parts = time.split(':');
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

function buildBase(
  name: string,
  startTime: string | undefined,
  endTime: string | undefined,
  color: string,
  isDone: boolean,
  isAllDay: boolean,
): BaseWeekEvent {
  const startMinutes = startTime ? parseTimeToMinutes(startTime) : 0;
  const endMinutes = endTime ? parseTimeToMinutes(endTime) : (isAllDay ? 1440 : startMinutes + 30);
  const durationMinutes = Math.max(endMinutes - startMinutes, 15);
  const timeRange = formatTimeRange(startTime, endTime);

  return {
    name,
    startTime,
    endTime,
    color,
    isDone,
    isAllDay,
    startMinutes,
    endMinutes,
    durationMinutes,
    timeRange,
  };
}

// --- Factories ---

export function createTaskEvent(task: Task): TaskWeekEvent {
  const isAllDay = !task.start_time && !task.end_time;
  const base = buildBase(
    task.name,
    task.start_time ?? undefined,
    task.end_time ?? undefined,
    task.color || 'var(--ion-color-danger)',
    task.status === TaskStatus.Done,
    isAllDay,
  );

  return { ...base, type: 'task', task };
}

export function createPlanTaskEvent(
  planTask: WeekPlanTask,
  date: string,
): PlanTaskWeekEvent {
  const isAllDay = !planTask.start_time && !planTask.end_time;
  const base = buildBase(
    planTask.name,
    planTask.start_time ?? undefined,
    planTask.end_time ?? undefined,
    planTask.plan_color || 'var(--ion-color-primary)',
    planTask.is_completed,
    isAllDay,
  );

  return {
    ...base,
    type: 'planTask',
    planTask,
    date,
    planId: planTask.plan_id,
    planName: planTask.plan_name,
  };
}

export function createCountdownEvent(countdown: Countdown): CountdownWeekEvent {
  const base = buildBase(
    countdown.name,
    undefined,
    undefined,
    'var(--ion-color-tertiary)',
    false,
    true,
  );

  return { ...base, type: 'countdown', countdown };
}
