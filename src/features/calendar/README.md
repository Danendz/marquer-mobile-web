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

## Client Logic to Implement

### Week View Event Layout (P0 — custom build, port from Flutter)
Flutter ref: `lib/components/calendar/week_view/event_layout.dart` — **port directly**

Sweep-line algorithm for positioning timed events in a day column:
1. Sort events by start time
2. Group into **overlap clusters** (transitive closure — if A overlaps B and B overlaps C, all one cluster)
3. For each cluster:
   - Calculate peak concurrent events (sweep line with endpoints)
   - **3+ overlaps**: Show first event full-width + "+N" badge (others hidden)
   - **1-2 overlaps**: Side-by-side columns, width = `columnWidth / concurrentCount`
4. Overlap test: `a.start < b.end && b.start < a.end`

Time parsing: `"HH:MM"` → minutes since midnight. Duration clamped to `[15, 1440]` minutes.

### Week Event Types
Flutter ref: `lib/components/calendar/week_view/week_event.dart`

Discriminated union with 3 variants:
- `TaskEvent` — wraps `Task`, color from task.color or default
- `PlanTaskEvent` — wraps `WeekPlanTask`, `isDone` from `is_completed`
- `CountdownEvent` — all-day, no time, static color

Computed properties: `startMinutes`, `endMinutes`, `durationMinutes`, `isAllDay`, `timeRange`

### Week Navigation
Flutter ref: `lib/components/calendar/week_view/week_view.dart`
- Base page = 1000 (infinite scroll both ways)
- `mondayOf(date)` — available in `shared/utils/date.ts`
- `mondayForPage(page)` = `baseMonday + (page - 1000) * 7 days`
- On page change: maintain selected weekday across weeks
- Default scroll position: current hour minus 80px offset

### Plan Group Backgrounds
Flutter ref: `lib/components/calendar/week_view/day_column.dart`

Group `PlanTaskEvent`s by `plan_id`, render semi-transparent background behind all events from same plan. Calculate bounds from min start to max end time across the group. Color: plan color with low alpha.

### Current Time Indicator
Updates every 60 seconds. Y position = `(hour * 60 + minute) * pixelsPerMinute`. Constants: `kPixelsPerHour = 60`, `kPixelsPerMinute = 1`.

### Month View Markers
Flutter ref: `lib/screens/calendar/views/calendar_month_view.dart`

Up to 3 colored dots per day cell:
- Red: dates with incomplete tasks (from `CalendarOverview.tasks`)
- Primary color: countdowns on that date
- Amber: dates with active plans (from `CalendarOverview.plan_tasks`)

### Countdown Display
Uses `daysUntil()` and `daysLabel()` from `shared/utils/date.ts`. Past countdowns get reduced opacity (0.5).

### Plan Form — Schedule Builder/Parser
Flutter ref: `lib/providers/calendar/plan_form_notifier.dart`

**Build**: Form fields → `PlanSchedule` discriminated union (for API submission)
**Parse**: `PlanSchedule` → form fields (for editing existing plans)

Schedule constants:
- `weekdayLabels = ['Mon', 'Tue', ..., 'Sun']`
- `weekOccurrenceLabels = ['First', 'Second', 'Third', 'Fourth', 'Last']`
- `weekOccurrenceValues = [1, 2, 3, 4, -1]` (−1 = last)

### Plan Form Validation
- Name required
- At least one task with non-empty name
- End date >= start date (when end date enabled)
- Weekly: min 1 weekday selected
- Monthly dates: min 1 day selected
- Tasks sorted by `start_time` (nulls first) before submission

### Schedule Label Generation
Human-readable descriptions: `"Daily"`, `"Weekly (Mon, Wed, Fri)"`, `"Every 3 days"`, `"Monthly on 1st, 15th"`, `"First Monday of month"`

### Key Flutter Reference Files
| File | Lines | What |
|------|-------|------|
| `lib/components/calendar/week_view/event_layout.dart` | ~150 | Overlap layout algorithm — **port directly** |
| `lib/components/calendar/week_view/week_event.dart` | ~100 | Event type hierarchy |
| `lib/components/calendar/week_view/week_view.dart` | ~200 | Week navigation + pagination |
| `lib/providers/calendar/plan_form_notifier.dart` | 129 | Plan form ↔ schedule conversion |
