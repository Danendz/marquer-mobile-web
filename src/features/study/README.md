# Feature: Study

## Purpose
Study session tracking with timer modes (count-up, count-down, pomodoro), subject management, statistics, and user study settings.

## Directory Structure
```
study/
  components/    # Timer display, SubjectPicker, StatsChart (TBD)
  composables/   # 4 query + 8 mutation composables
  api/           # study.api.ts — raw axios calls + query keys
  store/         # study.store.ts — Pinia store for active timer state (TBD)
  types/         # study.types.ts — StudySession, StudySubject, StudyStats, enums, payloads
  __tests__/     # Unit tests
```

## Implemented Files
- `types/study.types.ts` — StudySubject, StudySession, StudyStats, UserStudySettings, StudySessionStatus/TimerMode enums, all payloads
- `api/study.api.ts` — 12 API functions + `studyKeys` query key factory
- `composables/useStudySubjectsQuery.ts` — subjects list (stale: LONG)
- `composables/useStudySessionsQuery.ts` — sessions with reactive params (stale: SHORT)
- `composables/useStudyStatsQuery.ts` — stats (stale: SHORT)
- `composables/useStudySettingsQuery.ts` — settings (stale: LONG)
- `composables/useCreateStudySubjectMutation.ts`
- `composables/useUpdateStudySubjectMutation.ts`
- `composables/useDeleteStudySubjectMutation.ts`
- `composables/useCreateStudySessionMutation.ts`
- `composables/useUpdateStudySessionMutation.ts`
- `composables/useCompleteStudySessionMutation.ts`
- `composables/useCancelStudySessionMutation.ts`
- `composables/useUpsertStudySettingsMutation.ts`

## Conventions
- **API file**: `study.api.ts` + `export const studyKeys = { ... }`
- **Store**: `study.store.ts` — needed for active timer FSM (client-side state, not server)
- **Types**: `study.types.ts`

## API Endpoints
- `GET /study/sessions` — list sessions (query: status, study_subject_id, date_from, date_to)
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
