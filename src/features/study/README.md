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

## Client Logic to Implement

### Timer State Machine (P0 — most complex client logic)
Port directly from Flutter: `lib/providers/study/timer_state_machine.dart` (197 lines)
Lives in: `src/features/study/store/study.store.ts` (Pinia store)

**Three modes:**
- **Count-Up**: Simple increment each tick, runs until manually stopped
- **Count-Down**: Increments `elapsedSeconds` until `targetSeconds`, auto-completes
- **Pomodoro**: Multi-phase FSM
  - Phases: `work → shortBreak → work → ... → work → longBreak → done`
  - `elapsedSeconds` only counts during work phases (breaks excluded)
  - `phaseElapsedSeconds` tracks current phase progress
  - `completedCycles` increments after each work phase
  - Auto-transitions when `phaseElapsedSeconds >= currentPhaseTotalSeconds`

**Tick returns**: `{ newState, phaseCompleted, timerCompleted }` — UI reacts to flags for sound/vibration

### Background Timer Recovery
Flutter ref: `timer_state_machine.dart` → `recoverMissedTime(state, missedSeconds)`

Use **Page Visibility API**: save timestamp on `visibilitychange` hidden, compute delta on visible, feed through state machine. For pomodoro, recovery can cross multiple phase boundaries.

**Virtual start time**: `virtualStartMs = now - elapsed * 1000`. On resume: `elapsed = (now - virtualStartMs) / 1000`. No background ticking needed.

### Timer Persistence (Capacitor Preferences)
Keys to persist: `timer_session_id`, `timer_elapsed_seconds`, `timer_completed_cycles`, `timer_virtual_start_ms`, `timer_phase`, `timer_phase_virtual_start_ms`, `timer_mode`, `timer_paused`

### Session Completion Rules
- Session < 60 seconds → cancel (doesn't count as study time)
- Session >= 60 seconds → complete with `actual_duration_seconds` + `pomodoro_completed_cycles`
- Periodic sync to server every 60 seconds (prevents data loss on crash)

### Session Form Validation
Flutter ref: `lib/providers/study/session_form_notifier.dart`
- Name must not be empty
- Count-Down: min 1 minute, max 600 minutes (10 hours)
- Pomodoro: work >= 1min, short break >= 1min, long break >= 1min, cycles >= 1

### Sound & Vibration Feedback
Flutter ref: `lib/services/timer_feedback_service.dart`
- **Timer complete**: Play `timer_complete.mp3` + vibration pattern `[0, 500, 200, 500, 200, 500]`
- **Phase complete** (pomodoro only): Vibration only (same pattern)
- Web: Web Audio API + `navigator.vibrate()`
- Native: `@capacitor/haptics` for vibration

### Capacitor Plugins Needed
- `@capacitor-community/keep-awake` — WakeLock during active timer
- `@capacitor/haptics` — vibration feedback on timer/phase completion
- `@capacitor/local-notifications` — timer reminders (no true foreground service in Capacitor)

### Key Flutter Reference Files
| File | Lines | What |
|------|-------|------|
| `lib/providers/study/timer_state_machine.dart` | 197 | Pure timer FSM — **port directly** |
| `lib/providers/study/timer_provider.dart` | 467 | Timer orchestration + persistence |
| `lib/providers/study/session_form_notifier.dart` | 129 | Session form validation |
| `lib/services/timer_feedback_service.dart` | 38 | Sound + vibration |
