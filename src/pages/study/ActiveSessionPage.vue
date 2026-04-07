<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="active-session-toolbar">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" color="light" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :scroll-y="false" class="active-session-content">
      <!-- Background image -->
      <div class="active-session-bg" :style="{ backgroundImage: `url(${backgroundImage})` }" />

      <!-- Glass overlay -->
      <div class="active-session-overlay">
        <!-- Timer display -->
        <div class="active-session-center breathing">
          <ProgressRing :progress="store.timerProgress" :size="260" :stroke-width="8">
            <span class="timer-display">{{ store.formattedTime }}</span>
          </ProgressRing>

          <!-- Phase / cycle info for Pomodoro -->
          <div v-if="store.timerState.mode === TimerMode.Pomodoro" class="pomodoro-info">
            <span class="phase-label">{{ store.phaseLabel }}</span>
            <span class="cycle-count">
              Cycle {{ store.timerState.completedCycles + 1 }} / {{ store.timerState.totalCycles }}
            </span>
          </div>
        </div>

        <!-- Controls -->
        <div class="active-session-controls">
          <!-- Pause / Resume -->
          <button
            class="glass-button"
            @click="store.timerState.isRunning ? store.pause() : store.resume()"
          >
            <ion-icon :icon="store.timerState.isRunning ? mdiPause : mdiPlayArrow" />
            <span>{{ store.timerState.isRunning ? 'Pause' : 'Resume' }}</span>
          </button>

          <!-- Stop -->
          <button class="glass-button glass-button--danger" @click="handleStop">
            <ion-icon :icon="mdiStop" />
            <span>Stop</span>
          </button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButtons,
  IonBackButton,
  IonIcon,
  useIonRouter,
} from '@ionic/vue';
import { mdiPause, mdiPlayArrow, mdiStop } from '@/shared/icons/material';
import ProgressRing from '@/features/study/components/ProgressRing.vue';
import { useStudyStore } from '@/features/study/store/study.store';
import { TimerMode } from '@/features/study/types/study.types';
import { randomTimerBackgroundUrl } from '@/shared/constants/timerBackgrounds';

const store = useStudyStore();
const router = useIonRouter();

const backgroundImage = ref(randomTimerBackgroundUrl());

async function handleStop() {
  await store.stop();
  router.back();
}
</script>

<style scoped>
.active-session-toolbar {
  --background: transparent;
  --border-width: 0;
}

.active-session-content {
  --background: transparent;
}

.active-session-bg {
  position: fixed;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 0;
}

.active-session-overlay {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 24px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.active-session-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex: 1;
  justify-content: center;
}

.breathing {
  animation: breathe 4s ease-in-out infinite;
}

@keyframes breathe {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
}

.timer-display {
  font-size: 48px;
  font-weight: 200;
  color: #ffffff;
  font-variant-numeric: tabular-nums;
  letter-spacing: 2px;
}

.pomodoro-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.phase-label {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.cycle-count {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.active-session-controls {
  display: flex;
  gap: 16px;
  padding-bottom: env(safe-area-inset-bottom, 16px);
}

.glass-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;
}

.glass-button:active {
  background: rgba(255, 255, 255, 0.25);
}

.glass-button--danger {
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.2);
}

.glass-button--danger:active {
  background: rgba(239, 68, 68, 0.35);
}

.glass-button ion-icon {
  font-size: 20px;
}
</style>
