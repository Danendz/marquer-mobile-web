import type { PlanSchedule } from '@/features/calendar/types/calendar.types';

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const weekOccurrenceLabels = ['First', 'Second', 'Third', 'Fourth', 'Last'];

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Generate a human-readable description of a PlanSchedule.
 */
export function scheduleLabel(schedule: PlanSchedule): string {
  switch (schedule.type) {
    case 'daily':
      return 'Daily';

    case 'weekly': {
      const dayNames = schedule.days
        .slice()
        .sort((a, b) => a - b)
        .map((d) => weekdayLabels[d - 1] ?? `Day ${d}`);
      if (dayNames.length === 7) return 'Every day';
      if (dayNames.length === 5 && schedule.days.every((d) => d >= 1 && d <= 5)) {
        return 'Weekdays';
      }
      return `Weekly (${dayNames.join(', ')})`;
    }

    case 'interval':
      if (schedule.every === 1) return 'Daily';
      return `Every ${schedule.every} days`;

    case 'monthly_dates': {
      const dates = schedule.days
        .slice()
        .sort((a, b) => a - b)
        .map(ordinal);
      return `Monthly on ${dates.join(', ')}`;
    }

    case 'monthly_weekday': {
      const occurrence = weekOccurrenceLabels[schedule.week - 1] ?? `Week ${schedule.week}`;
      const day = weekdayLabels[schedule.weekday - 1] ?? `Day ${schedule.weekday}`;
      return `${occurrence} ${day} of month`;
    }

    default:
      return 'Custom';
  }
}
