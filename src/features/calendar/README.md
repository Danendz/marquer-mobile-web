# Feature: Calendar

## Purpose
Calendar views (month/week), plan management with recurring tasks, and countdown tracking.

## Directory Structure
```
calendar/
  components/    # CalendarGrid, PlanCard, CountdownCard, WeekView (TBD)
  composables/   # 5 query + 7 mutation composables
  api/           # calendar.api.ts — raw axios calls + query keys
  types/         # calendar.types.ts — Plan, PlanSchedule, Countdown, WeekData, etc.
  __tests__/     # Unit tests
```

## Implemented Files
- `types/calendar.types.ts` — Plan, PlanSchedule (discriminated union), PlanTask, Countdown, CalendarOverview, WeekData, WeekPlanTask, all payloads
- `api/calendar.api.ts` — 12 API functions + `calendarKeys` query key factory
- `composables/useCalendarOverviewQuery.ts` — overview with from/to (stale: SHORT)
- `composables/useWeekDataQuery.ts` — week data with from/to (stale: SHORT)
- `composables/useCountdownsQuery.ts` — countdowns list (stale: LONG)
- `composables/usePlansQuery.ts` — plans list (stale: MEDIUM)
- `composables/usePlansForDateQuery.ts` — plans for date (stale: SHORT)
- `composables/useCreateCountdownMutation.ts`
- `composables/useUpdateCountdownMutation.ts`
- `composables/useDeleteCountdownMutation.ts`
- `composables/useCreatePlanMutation.ts`
- `composables/useUpdatePlanMutation.ts`
- `composables/useDeletePlanMutation.ts`
- `composables/useTogglePlanTaskMutation.ts`

## Conventions
- **API file**: `calendar.api.ts` + `export const calendarKeys = { ... }`
- **No Pinia store** — calendar view mode and selected date can use local composables with `ref()`
- **Types**: `calendar.types.ts`
- **PlanSchedule**: discriminated union with `type` field (daily, weekly, interval, monthly_dates, monthly_weekday)

## API Endpoints
- `GET /calendar/overview` — month overview (query: from, to)
- `GET /calendar/week` — week view data (query: from, to)
- `GET /calendar/plans` — list plans
- `POST /calendar/plans` — create plan
- `PUT /calendar/plans/{id}` — update plan
- `DELETE /calendar/plans/{id}` — delete plan
- `GET /calendar/plans/for-date` — plans for specific date (query: date)
- `POST /calendar/plan-tasks/{id}/toggle` — toggle task completion (query: date)
- `GET /calendar/countdowns` — list countdowns
- `POST /calendar/countdowns` — create countdown
- `PUT /calendar/countdowns/{id}` — update countdown
- `DELETE /calendar/countdowns/{id}` — delete countdown

## Related Pages
- `src/pages/calendar/CalendarPage.vue`
- `src/pages/calendar/PlanFormPage.vue`
- `src/pages/calendar/CountdownDetailPage.vue`
