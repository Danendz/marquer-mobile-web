<template>
  <div
    class="session-card"
    :style="{ backgroundColor: bgColor }"
  >
    <div class="session-card__header">
      <span class="session-card__name">{{ session.name }}</span>
      <span class="session-card__status" :class="`session-card__status--${session.status}`">
        {{ statusLabel }}
      </span>
    </div>

    <div v-if="session.subject" class="session-card__detail">
      <ion-icon :icon="mdiCategory" class="session-card__icon" />
      <span>{{ session.subject.name }}</span>
    </div>

    <div class="session-card__detail">
      <ion-icon :icon="modeIcon" class="session-card__icon" />
      <span>{{ modeLabel }}</span>
      <span v-if="session.timer_mode === TimerMode.Pomodoro" class="session-card__cycles">
        {{ session.pomodoro_completed_cycles }}/{{ session.pomodoro_cycles }} cycles
      </span>
      <span class="session-card__duration">{{ formatDuration(session.actual_duration_seconds) }}</span>
    </div>

    <div class="session-card__date">
      {{ formatDate(session.started_at) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonIcon } from '@ionic/vue';
import { mdiTimer, mdiTrendingUp, mdiCategory } from '@/shared/icons/material';
import { formatDuration, formatDate } from '@/shared/utils/date';
import type { StudySession } from '@/features/study/types/study.types';
import { TimerMode, StudySessionStatus } from '@/features/study/types/study.types';

const props = defineProps<{
  session: StudySession;
}>();

const bgColor = computed(() => {
  const color = props.session.subject?.color;
  if (!color) return 'var(--color-surface)';
  return `${color}26`; // 15% alpha (hex)
});

const modeIcon = computed(() => {
  switch (props.session.timer_mode) {
    case TimerMode.CountUp:
      return mdiTrendingUp;
    case TimerMode.CountDown:
      return mdiTimer;
    case TimerMode.Pomodoro:
      return mdiTimer;
    default:
      return mdiTimer;
  }
});

const modeLabel = computed(() => {
  switch (props.session.timer_mode) {
    case TimerMode.CountUp:
      return 'Count Up';
    case TimerMode.CountDown:
      return 'Count Down';
    case TimerMode.Pomodoro:
      return 'Pomodoro';
    default:
      return '';
  }
});

const statusLabel = computed(() => {
  switch (props.session.status) {
    case StudySessionStatus.Active:
      return 'Active';
    case StudySessionStatus.Paused:
      return 'Paused';
    case StudySessionStatus.Completed:
      return 'Completed';
    case StudySessionStatus.Cancelled:
      return 'Cancelled';
    default:
      return '';
  }
});
</script>

<style scoped>
.session-card {
  padding: 12px 16px;
  border: 1px solid var(--color-outline);
  border-radius: 12px;
  margin-bottom: 8px;
}

.session-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.session-card__name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-on-surface);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-card__status {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.session-card__status--completed {
  background-color: rgba(22, 163, 74, 0.15);
  color: #16a34a;
}

.session-card__status--active {
  background-color: rgba(74, 122, 232, 0.15);
  color: #4a7ae8;
}

.session-card__status--paused {
  background-color: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.session-card__status--cancelled {
  background-color: rgba(220, 38, 38, 0.15);
  color: #dc2626;
}

.session-card__detail {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-size: 12px;
  color: var(--color-on-surface-variant);
}

.session-card__icon {
  font-size: 14px;
  flex-shrink: 0;
}

.session-card__cycles {
  margin-left: 4px;
  opacity: 0.7;
}

.session-card__duration {
  margin-left: auto;
  font-weight: 500;
}

.session-card__date {
  margin-top: 6px;
  font-size: 11px;
  color: var(--color-on-surface-variant);
  opacity: 0.7;
}
</style>
