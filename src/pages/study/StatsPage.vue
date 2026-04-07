<template>
  <ion-page>
    <AppHeader title="Study Stats">
      <template #start>
        <ion-back-button default-href="/" />
      </template>
    </AppHeader>

    <ion-content class="ion-padding">
      <!-- Summary cards -->
      <div class="stats-summary">
        <div class="stats-card">
          <ion-icon :icon="mdiSchedule" class="stats-card__icon" />
          <span class="stats-card__value">{{ todayDuration }}</span>
          <span class="stats-card__label">Today's Total</span>
        </div>
        <div class="stats-card">
          <ion-icon :icon="mdiLayers" class="stats-card__icon" />
          <span class="stats-card__value">{{ sessionCount }}</span>
          <span class="stats-card__label">Sessions</span>
        </div>
      </div>

      <!-- Session list -->
      <h3 v-if="sessions?.length" class="text-sm font-semibold text-gray-500 uppercase tracking-wide mt-6 mb-3">
        Recent Sessions
      </h3>

      <SessionCard
        v-for="session in sessions"
        :key="session.id"
        :session="session"
      />

      <EmptyState
        v-if="!isLoadingSessions && !sessions?.length"
        :icon="mdiTimer"
        title="No sessions yet"
        description="Start a study session to see your stats here"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  IonPage,
  IonContent,
  IonBackButton,
  IonIcon,
} from '@ionic/vue';
import AppHeader from '@/shared/components/AppHeader.vue';
import { mdiSchedule, mdiLayers, mdiTimer } from '@/shared/icons/material';
import SessionCard from '@/features/study/components/SessionCard.vue';
import EmptyState from '@/shared/components/EmptyState.vue';
import { useStudyStatsQuery } from '@/features/study/composables/useStudyStatsQuery';
import { useStudySessionsQuery } from '@/features/study/composables/useStudySessionsQuery';
import { formatDuration } from '@/shared/utils/date';

const { data: stats } = useStudyStatsQuery();
const { data: sessions, isLoading: isLoadingSessions } = useStudySessionsQuery();

const todayDuration = computed(() => {
  const seconds = stats.value?.today_total_seconds ?? 0;
  return formatDuration(seconds);
});

const sessionCount = computed(() => {
  return sessions.value?.length ?? 0;
});
</script>

<style scoped>
.stats-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stats-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background: rgba(var(--ion-color-primary-rgb), 0.12);
  border-radius: 16px;
}

.stats-card__icon {
  font-size: 20px;
  color: var(--ion-color-primary);
  margin-bottom: 12px;
}

.stats-card__value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-on-surface);
}

.stats-card__label {
  font-size: 13px;
  color: var(--color-on-surface-variant);
  margin-top: 4px;
}
</style>
