import type { ID, Timestamp } from '@/shared/types/common';

export enum StudySessionStatus {
  Active = 'active',
  Paused = 'paused',
  Completed = 'completed',
  Cancelled = 'cancelled',
}

export enum TimerMode {
  CountUp = 'count_up',
  CountDown = 'count_down',
  Pomodoro = 'pomodoro',
}

export interface StudySubject {
  id: ID;
  name: string;
  color: string;
  is_system: boolean;
  created_at: Timestamp;
}

export interface UpsertStudySubjectPayload {
  name: string;
  color: string;
}

export interface StudySession {
  id: ID;
  user_id: ID;
  study_subject_id?: ID;
  name: string;
  timer_mode: TimerMode;
  status: StudySessionStatus;
  planned_duration_seconds?: number;
  actual_duration_seconds: number;
  started_at: Timestamp;
  ended_at?: Timestamp;
  pomodoro_work_minutes?: number;
  pomodoro_short_break_minutes?: number;
  pomodoro_long_break_minutes?: number;
  pomodoro_cycles?: number;
  pomodoro_completed_cycles: number;
  subject?: StudySubject;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface StoreStudySessionPayload {
  name: string;
  study_subject_id?: ID;
  timer_mode: TimerMode;
  planned_duration_seconds?: number;
  pomodoro_work_minutes?: number;
  pomodoro_short_break_minutes?: number;
  pomodoro_long_break_minutes?: number;
  pomodoro_cycles?: number;
}

export interface CompleteStudySessionPayload {
  actual_duration_seconds: number;
  pomodoro_completed_cycles?: number;
}

export interface GetStudySessionsParams {
  status?: StudySessionStatus;
  study_subject_id?: ID;
  date_from?: string;
  date_to?: string;
}

export interface StudyStats {
  today_total_seconds: number;
  sessions: StudySession[];
}

export interface UserStudySettings {
  default_work_minutes: number;
  default_short_break_minutes: number;
  default_long_break_minutes: number;
  default_cycles: number;
}
