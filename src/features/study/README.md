# Feature: Study

## Purpose
Study session tracking with timer modes (count-up, count-down, pomodoro), subject management, statistics, and user study settings.

## Directory Structure
```
study/
  components/    # Timer display, SubjectPicker, StatsChart
  composables/   # useStudySessionsQuery, useStudyTimer, useStudySubjects
  api/           # study.api.ts — raw axios calls + query keys
  store/         # study.store.ts — Pinia store for active timer state (client-side)
  types/         # study.types.ts — StudySession, StudySubject, StudyStats, TimerMode
  __tests__/     # Unit tests
```

## Conventions
- **API file**: `study.api.ts` + `export const studyKeys = { ... }`
- **Store**: `study.store.ts` — needed for active timer FSM (client-side state, not server)
- **Types**: `study.types.ts`

## API Endpoints
- `GET /study/sessions` — list sessions (query: status, studySubjectId, dateFrom, dateTo)
- `POST /study/sessions` — create session
- `PUT /study/sessions/{id}` — update session
- `POST /study/sessions/{id}/complete` — complete session
- `POST /study/sessions/{id}/cancel` — cancel session
- `GET /study/sessions/stats` — get statistics
- `GET /study/subjects` — list subjects
- `POST /study/subjects` — create subject
- `PUT /study/subjects/{id}` — update subject
- `DELETE /study/subjects/{id}` — delete subject
- `GET /study/settings` — get user study settings
- `PUT /study/settings` — update study settings

## Related Pages
- `src/pages/study/ActiveSessionPage.vue`
- `src/pages/study/StatsPage.vue`
- `src/pages/study/SubjectsPage.vue`
