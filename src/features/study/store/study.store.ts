import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { formatTimerTime } from '@/shared/utils/date';
import {
  updateStudySessionApi,
  completeStudySessionApi,
  cancelStudySessionApi,
} from '@/features/study/api/study.api';
import { TimerMode } from '@/features/study/types/study.types';
import type { ID } from '@/shared/types/common';

// ---------------------------------------------------------------------------
// Timer phase enum
// ---------------------------------------------------------------------------

export enum TimerPhase {
  Idle = 'idle',
  Work = 'work',
  ShortBreak = 'shortBreak',
  LongBreak = 'longBreak',
}

// ---------------------------------------------------------------------------
// Pure timer state & helpers (exported for testability)
// ---------------------------------------------------------------------------

export interface TimerState {
  isRunning: boolean;
  phase: TimerPhase;
  /** Total study time in seconds (excludes breaks). */
  elapsedSeconds: number;
  /** Elapsed seconds within the current phase. */
  phaseElapsedSeconds: number;
  mode: TimerMode;
  completedCycles: number;
  totalCycles: number;
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  /** Target seconds for countdown mode. */
  targetSeconds: number | null;
  stopRequested: boolean;
}

export function createInitialTimerState(): TimerState {
  return {
    isRunning: false,
    phase: TimerPhase.Idle,
    elapsedSeconds: 0,
    phaseElapsedSeconds: 0,
    mode: TimerMode.CountUp,
    completedCycles: 0,
    totalCycles: 4,
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    targetSeconds: null,
    stopRequested: false,
  };
}

export function currentPhaseTotalSeconds(state: TimerState): number {
  switch (state.phase) {
    case TimerPhase.Work:
      return state.workMinutes * 60;
    case TimerPhase.ShortBreak:
      return state.shortBreakMinutes * 60;
    case TimerPhase.LongBreak:
      return state.longBreakMinutes * 60;
    case TimerPhase.Idle:
      return 0;
  }
}

export function remainingSeconds(state: TimerState): number {
  switch (state.mode) {
    case TimerMode.CountDown: {
      const target = state.targetSeconds ?? 0;
      return Math.max(target - state.elapsedSeconds, 0);
    }
    case TimerMode.Pomodoro: {
      const phaseTotal = currentPhaseTotalSeconds(state);
      return Math.max(phaseTotal - state.phaseElapsedSeconds, 0);
    }
    default:
      return state.elapsedSeconds;
  }
}

export function displaySeconds(state: TimerState): number {
  switch (state.mode) {
    case TimerMode.CountDown:
      return remainingSeconds(state);
    case TimerMode.Pomodoro:
      return remainingSeconds(state);
    default:
      return state.elapsedSeconds;
  }
}

export function progress(state: TimerState): number {
  switch (state.mode) {
    case TimerMode.CountDown: {
      const target = state.targetSeconds ?? 1;
      return Math.min(state.elapsedSeconds / target, 1);
    }
    case TimerMode.Pomodoro: {
      const phaseTotal = currentPhaseTotalSeconds(state);
      if (phaseTotal === 0) return 0;
      return Math.min(state.phaseElapsedSeconds / phaseTotal, 1);
    }
    default:
      return 0;
  }
}

// ---------------------------------------------------------------------------
// Pure tick functions (exported for testability)
// ---------------------------------------------------------------------------

export interface TickResult {
  state: TimerState;
  completed: boolean;
}

function tickPomodoro(state: TimerState): TickResult {
  const next = { ...state, phaseElapsedSeconds: state.phaseElapsedSeconds + 1 };
  const phaseTotal = currentPhaseTotalSeconds(next);

  // Count study time only during work phase
  if (next.phase === TimerPhase.Work) {
    next.elapsedSeconds = state.elapsedSeconds + 1;
  }

  if (next.phaseElapsedSeconds >= phaseTotal) {
    return handlePomodoroPhaseComplete(next);
  }
  return { state: next, completed: false };
}

function handlePomodoroPhaseComplete(state: TimerState): TickResult {
  if (state.phase === TimerPhase.Work) {
    const cycles = state.completedCycles + 1;
    const allDone = cycles >= state.totalCycles;
    const nextPhase = allDone ? TimerPhase.LongBreak : TimerPhase.ShortBreak;
    return {
      state: { ...state, completedCycles: cycles, phase: nextPhase, phaseElapsedSeconds: 0 },
      completed: false,
    };
  }

  if (state.phase === TimerPhase.LongBreak) {
    // All cycles done, long break finished -> timer complete
    return {
      state: { ...state, isRunning: false, phase: TimerPhase.Idle, phaseElapsedSeconds: 0 },
      completed: true,
    };
  }

  // Short break -> back to work
  return {
    state: { ...state, phase: TimerPhase.Work, phaseElapsedSeconds: 0 },
    completed: false,
  };
}

export function tick(state: TimerState): TickResult {
  if (!state.isRunning) return { state, completed: false };

  if (state.mode === TimerMode.Pomodoro) {
    return tickPomodoro(state);
  }

  // Count-up
  if (state.mode === TimerMode.CountUp) {
    return {
      state: { ...state, elapsedSeconds: state.elapsedSeconds + 1 },
      completed: false,
    };
  }

  // Count-down
  const elapsed = state.elapsedSeconds + 1;
  const target = state.targetSeconds ?? 0;
  if (elapsed >= target) {
    return {
      state: { ...state, elapsedSeconds: target, isRunning: false },
      completed: true,
    };
  }
  return {
    state: { ...state, elapsedSeconds: elapsed },
    completed: false,
  };
}

/**
 * Recover missed time (e.g. when app was in background).
 * Applies multiple ticks at once.
 */
export function recoverMissedTime(state: TimerState, missedSeconds: number): TickResult {
  if (missedSeconds <= 0 || !state.isRunning) return { state, completed: false };

  if (state.mode === TimerMode.CountUp) {
    return {
      state: { ...state, elapsedSeconds: state.elapsedSeconds + missedSeconds },
      completed: false,
    };
  }

  if (state.mode === TimerMode.CountDown) {
    const target = state.targetSeconds ?? 0;
    const elapsed = state.elapsedSeconds + missedSeconds;
    if (elapsed >= target) {
      return {
        state: { ...state, elapsedSeconds: target, isRunning: false },
        completed: true,
      };
    }
    return {
      state: { ...state, elapsedSeconds: elapsed },
      completed: false,
    };
  }

  // Pomodoro: loop through phase boundaries one second at a time
  let current = state;
  let completed = false;
  for (let i = 0; i < missedSeconds; i++) {
    const result = tick(current);
    current = result.state;
    if (result.completed) {
      completed = true;
      break;
    }
  }
  return { state: current, completed };
}

// ---------------------------------------------------------------------------
// Session config passed from CreateSessionSheet
// ---------------------------------------------------------------------------

export interface SessionConfig {
  name: string;
  studySubjectId?: ID;
  mode: TimerMode;
  /** For count-down: target minutes. */
  durationMinutes?: number;
  /** Pomodoro settings. */
  workMinutes?: number;
  shortBreakMinutes?: number;
  longBreakMinutes?: number;
  cycles?: number;
}

// ---------------------------------------------------------------------------
// Pinia Store
// ---------------------------------------------------------------------------

const SYNC_INTERVAL_MS = 60_000;
const MIN_SESSION_SECONDS = 60;

export const useStudyStore = defineStore('study', () => {
  // --- State ---
  const timerState = ref<TimerState>(createInitialTimerState());
  const intervalId = ref<ReturnType<typeof setInterval> | null>(null);
  const syncIntervalId = ref<ReturnType<typeof setInterval> | null>(null);
  const lastHiddenAt = ref<number | null>(null);
  const serverSessionId = ref<ID | null>(null);

  // --- Getters ---
  const display = computed(() => displaySeconds(timerState.value));
  const timerProgress = computed(() => progress(timerState.value));
  const formattedTime = computed(() => formatTimerTime(display.value));
  const isActive = computed(() => timerState.value.isRunning || timerState.value.elapsedSeconds > 0);

  const phaseLabel = computed(() => {
    switch (timerState.value.phase) {
      case TimerPhase.Work:
        return 'Work';
      case TimerPhase.ShortBreak:
        return 'Short Break';
      case TimerPhase.LongBreak:
        return 'Long Break';
      default:
        return '';
    }
  });

  // --- Visibility handling ---
  function onVisibilityChange() {
    if (document.hidden) {
      lastHiddenAt.value = Date.now();
    } else if (lastHiddenAt.value !== null && timerState.value.isRunning) {
      const missedMs = Date.now() - lastHiddenAt.value;
      const missedSec = Math.floor(missedMs / 1000);
      if (missedSec > 0) {
        const result = recoverMissedTime(timerState.value, missedSec);
        timerState.value = result.state;
        if (result.completed) {
          handleTimerCompleted();
        }
      }
      lastHiddenAt.value = null;
    }
  }

  // --- Sync to server ---
  async function syncToServer() {
    if (!serverSessionId.value || timerState.value.elapsedSeconds === 0) return;
    try {
      await updateStudySessionApi(serverSessionId.value, {
        actual_duration_seconds: timerState.value.elapsedSeconds,
        pomodoro_completed_cycles: timerState.value.completedCycles,
      });
    } catch {
      // Silently ignore sync errors — we'll try again next interval
    }
  }

  // --- Timer completed (auto-complete the session) ---
  async function handleTimerCompleted() {
    clearTimerIntervals();
    if (!serverSessionId.value) return;

    try {
      await completeStudySessionApi(serverSessionId.value, {
        actual_duration_seconds: timerState.value.elapsedSeconds,
        pomodoro_completed_cycles: timerState.value.completedCycles,
      });
    } catch {
      // Best effort
    }
    serverSessionId.value = null;
  }

  function clearTimerIntervals() {
    if (intervalId.value !== null) {
      clearInterval(intervalId.value);
      intervalId.value = null;
    }
    if (syncIntervalId.value !== null) {
      clearInterval(syncIntervalId.value);
      syncIntervalId.value = null;
    }
    document.removeEventListener('visibilitychange', onVisibilityChange);
  }

  // --- Actions ---
  function startSession(config: SessionConfig, sessionId: ID) {
    // Reset state
    const state = createInitialTimerState();
    state.isRunning = true;
    state.mode = config.mode;

    if (config.mode === TimerMode.CountDown) {
      state.targetSeconds = (config.durationMinutes ?? 25) * 60;
    } else if (config.mode === TimerMode.Pomodoro) {
      state.phase = TimerPhase.Work;
      state.workMinutes = config.workMinutes ?? 25;
      state.shortBreakMinutes = config.shortBreakMinutes ?? 5;
      state.longBreakMinutes = config.longBreakMinutes ?? 15;
      state.totalCycles = config.cycles ?? 4;
    }

    timerState.value = state;
    serverSessionId.value = sessionId;
    lastHiddenAt.value = null;

    // Start tick interval
    intervalId.value = setInterval(doTick, 1000);

    // Start periodic sync
    syncIntervalId.value = setInterval(syncToServer, SYNC_INTERVAL_MS);

    // Listen to visibility changes for background recovery
    document.addEventListener('visibilitychange', onVisibilityChange);
  }

  function doTick() {
    const result = tick(timerState.value);
    timerState.value = result.state;
    if (result.completed) {
      handleTimerCompleted();
    }
  }

  function pause() {
    timerState.value = { ...timerState.value, isRunning: false };
    if (intervalId.value !== null) {
      clearInterval(intervalId.value);
      intervalId.value = null;
    }
  }

  function resume() {
    timerState.value = { ...timerState.value, isRunning: true };
    lastHiddenAt.value = null;
    intervalId.value = setInterval(doTick, 1000);
  }

  async function stop() {
    const elapsed = timerState.value.elapsedSeconds;
    const completedCycles = timerState.value.completedCycles;
    const sessionId = serverSessionId.value;

    clearTimerIntervals();
    timerState.value = createInitialTimerState();
    serverSessionId.value = null;

    if (!sessionId) return;

    try {
      if (elapsed < MIN_SESSION_SECONDS) {
        await cancelStudySessionApi(sessionId);
      } else {
        await completeStudySessionApi(sessionId, {
          actual_duration_seconds: elapsed,
          pomodoro_completed_cycles: completedCycles,
        });
      }
    } catch {
      // Best effort
    }
  }

  return {
    // State
    timerState,
    serverSessionId,
    // Getters
    display,
    timerProgress,
    formattedTime,
    isActive,
    phaseLabel,
    // Actions
    startSession,
    pause,
    resume,
    stop,
  };
});
