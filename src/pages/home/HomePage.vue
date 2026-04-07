<template>
  <ion-page>
    <AppHeader title="Marquer" />

    <ion-content class="ion-padding">
      <!-- Active Session Banner -->
      <div v-if="studyStore.isActive" class="active-session-banner" @click="resumeSession">
        <div class="active-session-banner__info">
          <ion-icon :icon="mdiPlayCircleOutline" class="active-session-banner__icon" />
          <div>
            <p class="active-session-banner__label">Active Session</p>
            <p class="active-session-banner__time">{{ studyStore.formattedTime }}</p>
          </div>
        </div>
        <ion-button fill="clear" size="small">Resume</ion-button>
      </div>

      <!-- Study Time Card -->
      <div class="study-card">
        <ion-icon :icon="mdiTimer" class="study-card__icon" />
        <div class="study-card__text">
          <span class="study-card__label">Today's Study Time</span>
          <span class="study-card__value">{{ todayStudyTime }}</span>
        </div>
      </div>

      <!-- Action Tiles Grid -->
      <div class="tile-grid">
        <div class="tile" @click="router.push(ROUTE_PATHS.TASKS)">
          <div class="tile__icon tile__icon--indigo">
            <ion-icon :icon="mdiCheckCircleOutline" />
          </div>
          <span class="tile__label">Tasks</span>
        </div>

        <div class="tile" @click="showCreateSession = true">
          <div class="tile__icon tile__icon--primary">
            <ion-icon :icon="mdiPlayCircle" />
          </div>
          <span class="tile__label">Start Study</span>
        </div>

        <div class="tile" @click="router.push(ROUTE_PATHS.STUDY_STATS)">
          <div class="tile__icon tile__icon--teal">
            <ion-icon :icon="mdiBarChart" />
          </div>
          <span class="tile__label">Study Stats</span>
        </div>

        <div class="tile" @click="router.push(ROUTE_PATHS.SUBJECTS)">
          <div class="tile__icon tile__icon--orange">
            <ion-icon :icon="mdiCategory" />
          </div>
          <span class="tile__label">Subjects</span>
        </div>
      </div>

      <!-- Create Session Sheet -->
      <CreateSessionSheet
        :is-open="showCreateSession"
        @dismiss="showCreateSession = false"
        @start="startStudySession"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
} from '@ionic/vue';
import AppHeader from '@/shared/components/AppHeader.vue';
import {
  mdiPlayCircleOutline,
  mdiTimer,
  mdiPlayCircle,
  mdiCheckCircleOutline,
  mdiBarChart,
  mdiCategory,
} from '@/shared/icons/material';

import CreateSessionSheet from '@/features/study/components/CreateSessionSheet.vue';
import { useStudyStore, type SessionConfig } from '@/features/study/store/study.store';
import { useStudyStatsQuery } from '@/features/study/composables/useStudyStatsQuery';
import { useCreateStudySessionMutation } from '@/features/study/composables/useCreateStudySessionMutation';
import { formatDuration } from '@/shared/utils/date';
import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/constants/routes';
import { TimerMode } from '@/features/study/types/study.types';

const router = useRouter();
const studyStore = useStudyStore();
const showCreateSession = ref(false);

const { data: stats } = useStudyStatsQuery();

const todayStudyTime = computed(() => {
  if (!stats.value) return '0m';
  return formatDuration(stats.value.today_total_seconds);
});

function resumeSession() {
  router.push({ name: ROUTE_NAMES.ACTIVE_SESSION });
}

const createSessionMutation = useCreateStudySessionMutation();

function startStudySession(config: SessionConfig) {
  showCreateSession.value = false;
  createSessionMutation.mutate(
    {
      name: config.name,
      study_subject_id: config.studySubjectId,
      timer_mode: config.mode,
      planned_duration_seconds: config.durationMinutes ? config.durationMinutes * 60 : undefined,
      pomodoro_work_minutes: config.mode === TimerMode.Pomodoro ? config.workMinutes : undefined,
      pomodoro_short_break_minutes: config.mode === TimerMode.Pomodoro ? config.shortBreakMinutes : undefined,
      pomodoro_long_break_minutes: config.mode === TimerMode.Pomodoro ? config.longBreakMinutes : undefined,
      pomodoro_cycles: config.mode === TimerMode.Pomodoro ? config.cycles : undefined,
    },
    {
      onSuccess: (response) => {
        studyStore.startSession(config, response.data.id);
        router.push({ name: ROUTE_NAMES.ACTIVE_SESSION });
      },
    },
  );
}
</script>

<style scoped>
/* Active Session Banner */
.active-session-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--color-primary-container);
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
}

.active-session-banner__info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.active-session-banner__icon {
  font-size: 28px;
  color: var(--ion-color-primary);
}

.active-session-banner__label {
  font-size: 12px;
  color: var(--color-on-primary-container);
  margin: 0;
}

.active-session-banner__time {
  font-size: 20px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--color-on-primary-container);
  margin: 0;
}

/* Study Time Card */
.study-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--color-primary-container);
  border-radius: 16px;
}

.study-card__icon {
  font-size: 40px;
  color: var(--color-on-primary-container);
  flex-shrink: 0;
}

.study-card__text {
  display: flex;
  flex-direction: column;
}

.study-card__label {
  font-size: 14px;
  color: var(--color-on-primary-container);
}

.study-card__value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-on-primary-container);
  line-height: 1.2;
}

/* Tile Grid */
.tile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.tile {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  aspect-ratio: 1.1;
  padding: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-outline);
  border-radius: 16px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.tile:active {
  background: var(--color-surface-container);
}

/* Tile Icon Container */
.tile__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.tile__icon ion-icon {
  font-size: 24px;
}

/* Tile color variants */
.tile__icon--indigo {
  background: rgba(63, 81, 181, 0.1);
  color: #3f51b5;
}

.tile__icon--indigo ion-icon {
  color: #3f51b5;
}

.tile__icon--primary {
  background: rgba(74, 122, 232, 0.1);
  color: var(--ion-color-primary);
}

.tile__icon--primary ion-icon {
  color: var(--ion-color-primary);
}

.tile__icon--teal {
  background: rgba(0, 150, 136, 0.1);
  color: #009688;
}

.tile__icon--teal ion-icon {
  color: #009688;
}

.tile__icon--orange {
  background: rgba(255, 152, 0, 0.1);
  color: #ff9800;
}

.tile__icon--orange ion-icon {
  color: #ff9800;
}

/* Tile Label */
.tile__label {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-on-surface);
}
</style>
