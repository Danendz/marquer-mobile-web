# Feature: Calendar

## Purpose
Calendar views (month/week), plan management with recurring tasks, and countdown tracking.

## Directory Structure
```
calendar/
  components/    # CalendarGrid, PlanCard, CountdownCard, WeekView
  composables/   # useCalendarOverview, usePlansQuery, useCountdowns
  api/           # calendar.api.ts — raw axios calls + query keys
  types/         # calendar.types.ts — Plan, PlanTask, Countdown, CalendarOverview
  __tests__/     # Unit tests
```

## Conventions
- **API file**: `calendar.api.ts` + `export const calendarKeys = { ... }`
- **No Pinia store** — calendar view mode and selected date can use local composables with `ref()`
- **Types**: `calendar.types.ts`

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
