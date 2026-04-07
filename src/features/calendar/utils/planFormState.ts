import type { PlanSchedule } from '@/features/calendar/types/calendar.types';

export interface PlanFormState {
  name: string;
  color: string | null;
  scheduleType: PlanSchedule['type'];
  weeklyDays: number[];
  intervalEvery: number;
  monthlyDates: number[];
  monthlyWeekday: number;
  monthlyOccurrence: number;
  startDate: string;
  hasEndDate: boolean;
  endDate: string;
  tasks: { id?: number; name: string; startTime: string; endTime: string }[];
}

/**
 * Convert form state to a PlanSchedule for the API.
 */
export function buildSchedule(state: PlanFormState): PlanSchedule {
  switch (state.scheduleType) {
    case 'daily':
      return { type: 'daily' };

    case 'weekly':
      return { type: 'weekly', days: [...state.weeklyDays].sort((a, b) => a - b) };

    case 'interval':
      return { type: 'interval', every: state.intervalEvery };

    case 'monthly_dates':
      return { type: 'monthly_dates', days: [...state.monthlyDates].sort((a, b) => a - b) };

    case 'monthly_weekday':
      return {
        type: 'monthly_weekday',
        week: state.monthlyOccurrence,
        weekday: state.monthlyWeekday,
      };

    default:
      return { type: 'daily' };
  }
}

/**
 * Parse a PlanSchedule into partial form state for editing.
 */
export function parseSchedule(schedule: PlanSchedule): Partial<PlanFormState> {
  const base: Partial<PlanFormState> = { scheduleType: schedule.type };

  switch (schedule.type) {
    case 'daily':
      return base;

    case 'weekly':
      return { ...base, weeklyDays: [...schedule.days] };

    case 'interval':
      return { ...base, intervalEvery: schedule.every };

    case 'monthly_dates':
      return { ...base, monthlyDates: [...schedule.days] };

    case 'monthly_weekday':
      return {
        ...base,
        monthlyWeekday: schedule.weekday,
        monthlyOccurrence: schedule.week,
      };

    default:
      return base;
  }
}

/**
 * Validate plan form state. Returns error message or null.
 */
export function validatePlanForm(state: PlanFormState): string | null {
  if (!state.name.trim()) {
    return 'Plan name is required';
  }

  const nonEmptyTasks = state.tasks.filter((t) => t.name.trim().length > 0);
  if (nonEmptyTasks.length === 0) {
    return 'At least one task is required';
  }

  if (state.hasEndDate && state.endDate && state.startDate) {
    if (state.endDate < state.startDate) {
      return 'End date must be on or after start date';
    }
  }

  if (state.scheduleType === 'weekly' && state.weeklyDays.length === 0) {
    return 'Select at least one day for weekly schedule';
  }

  if (state.scheduleType === 'monthly_dates' && state.monthlyDates.length === 0) {
    return 'Select at least one date for monthly schedule';
  }

  return null;
}
