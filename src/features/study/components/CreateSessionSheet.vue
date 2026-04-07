<template>
  <ion-modal :is-open="isOpen" :initial-breakpoint="0.75" :breakpoints="[0, 0.75, 1]" @did-dismiss="$emit('dismiss')">
    <ion-content class="sheet-content">
      <div class="sheet-handle" />

      <!-- Header -->
      <div class="sheet-header">
        <div class="sheet-header__icon">
          <ion-icon :icon="mdiPlayCircleOutline" />
        </div>
        <div>
          <h2 class="sheet-header__title">New Study Session</h2>
          <p class="sheet-header__subtitle">Set up your focus session</p>
        </div>
      </div>

      <!-- Session name -->
      <div class="form-field">
        <ion-item lines="none" class="form-input">
          <ion-icon slot="start" :icon="mdiEdit" class="form-input__icon" />
          <ion-input
            v-model="name"
            label="Session name"
            label-placement="floating"
            placeholder="e.g. Math chapter 5"
          />
        </ion-item>
      </div>

      <!-- Subject picker -->
      <div class="form-field">
        <ion-item lines="none" class="form-input">
          <ion-icon slot="start" :icon="mdiCategory" class="form-input__icon" />
          <ion-select
            v-model="selectedSubjectId"
            label="Subject"
            label-placement="floating"
            placeholder="No subject"
            interface="action-sheet"
          >
            <ion-select-option :value="undefined">No subject</ion-select-option>
            <ion-select-option
              v-for="subject in subjects"
              :key="subject.id"
              :value="subject.id"
            >
              {{ subject.name }}
            </ion-select-option>
          </ion-select>
        </ion-item>
      </div>

      <!-- Timer mode -->
      <div class="form-section">
        <span class="form-section__label">Timer mode</span>
        <ion-segment v-model="mode">
          <ion-segment-button :value="TimerMode.CountUp">
            <ion-icon :icon="mdiTrendingUp" />
            <ion-label>Count-up</ion-label>
          </ion-segment-button>
          <ion-segment-button :value="TimerMode.CountDown">
            <ion-icon :icon="mdiTimer" />
            <ion-label>Count-down</ion-label>
          </ion-segment-button>
          <ion-segment-button :value="TimerMode.Pomodoro">
            <ion-icon :icon="mdiSync" />
            <ion-label>Pomodoro</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <!-- Count-Down duration chips -->
      <div v-if="mode === TimerMode.CountDown" class="form-section">
        <span class="form-section__label">Duration</span>
        <div class="duration-chips">
          <button
            v-for="d in DURATION_PRESETS"
            :key="d"
            class="chip"
            :class="{ 'chip--active': durationMinutes === d && !customDuration }"
            @click="selectDuration(d)"
          >
            {{ d }}m
          </button>
          <button
            class="chip"
            :class="{ 'chip--active': customDuration }"
            @click="customDuration = true"
          >
            Custom
          </button>
        </div>
        <ion-item v-if="customDuration" lines="none" class="form-input ion-margin-top">
          <ion-input
            v-model.number="durationMinutes"
            label="Minutes"
            label-placement="floating"
            type="number"
            :min="1"
            :max="600"
          />
        </ion-item>
      </div>

      <!-- Pomodoro settings -->
      <div v-if="mode === TimerMode.Pomodoro" class="form-section">
        <div class="pomodoro-card">
          <div class="pomodoro-row">
            <span class="pomodoro-row__label">Work</span>
            <div class="pomodoro-row__controls">
              <button class="stepper-btn" :disabled="workMins <= 1" @click="workMins--">-</button>
              <span class="pomodoro-row__value">{{ workMins }} min</span>
              <button class="stepper-btn" :disabled="workMins >= 120" @click="workMins++">+</button>
            </div>
          </div>
          <div class="pomodoro-divider" />
          <div class="pomodoro-row">
            <span class="pomodoro-row__label">Short break</span>
            <div class="pomodoro-row__controls">
              <button class="stepper-btn" :disabled="shortBreakMins <= 1" @click="shortBreakMins--">-</button>
              <span class="pomodoro-row__value">{{ shortBreakMins }} min</span>
              <button class="stepper-btn" :disabled="shortBreakMins >= 60" @click="shortBreakMins++">+</button>
            </div>
          </div>
          <div class="pomodoro-divider" />
          <div class="pomodoro-row">
            <span class="pomodoro-row__label">Long break</span>
            <div class="pomodoro-row__controls">
              <button class="stepper-btn" :disabled="longBreakMins <= 1" @click="longBreakMins--">-</button>
              <span class="pomodoro-row__value">{{ longBreakMins }} min</span>
              <button class="stepper-btn" :disabled="longBreakMins >= 60" @click="longBreakMins++">+</button>
            </div>
          </div>
          <div class="pomodoro-divider" />
          <div class="pomodoro-row">
            <span class="pomodoro-row__label">Cycles</span>
            <div class="pomodoro-row__controls">
              <button class="stepper-btn" :disabled="cycles <= 1" @click="cycles--">-</button>
              <span class="pomodoro-row__value">{{ cycles }}</span>
              <button class="stepper-btn" :disabled="cycles >= 20" @click="cycles++">+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Start button -->
      <button
        class="start-btn"
        :class="{ 'start-btn--disabled': !isValid }"
        :disabled="!isValid"
        @click="handleStart"
      >
        <ion-icon :icon="mdiPlayArrow" />
        <span>Start Session</span>
      </button>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  IonModal,
  IonContent,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
} from '@ionic/vue';
import {
  mdiPlayCircleOutline,
  mdiEdit,
  mdiCategory,
  mdiTrendingUp,
  mdiTimer,
  mdiSync,
  mdiPlayArrow,
} from '@/shared/icons/material';
import { TimerMode } from '@/features/study/types/study.types';
import { useStudySubjectsQuery } from '@/features/study/composables/useStudySubjectsQuery';
import { useStudySettingsQuery } from '@/features/study/composables/useStudySettingsQuery';
import type { SessionConfig } from '@/features/study/store/study.store';

const DURATION_PRESETS = [30, 60, 90, 120] as const;

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  dismiss: [];
  start: [config: SessionConfig];
}>();

const { data: subjects } = useStudySubjectsQuery();
const { data: settings } = useStudySettingsQuery();

const name = ref('');
const selectedSubjectId = ref<number | undefined>(undefined);
const mode = ref<TimerMode>(TimerMode.CountUp);

// Count-down
const durationMinutes = ref(30);
const customDuration = ref(false);

// Pomodoro
const workMins = ref(25);
const shortBreakMins = ref(5);
const longBreakMins = ref(15);
const cycles = ref(4);

// Pre-fill from settings when they load
watch(
  () => settings.value,
  (s) => {
    if (!s) return;
    workMins.value = s.default_work_minutes;
    shortBreakMins.value = s.default_short_break_minutes;
    longBreakMins.value = s.default_long_break_minutes;
    cycles.value = s.default_cycles;
  },
  { immediate: true },
);

// Reset fields when sheet opens
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      name.value = '';
      selectedSubjectId.value = undefined;
      mode.value = TimerMode.CountUp;
      durationMinutes.value = 30;
      customDuration.value = false;
    }
  },
);

function selectDuration(d: number) {
  durationMinutes.value = d;
  customDuration.value = false;
}

const isValid = computed(() => {
  if (!name.value.trim()) return false;
  if (mode.value === TimerMode.CountDown) {
    return durationMinutes.value >= 1 && durationMinutes.value <= 600;
  }
  if (mode.value === TimerMode.Pomodoro) {
    return workMins.value >= 1 && shortBreakMins.value >= 1 && longBreakMins.value >= 1 && cycles.value >= 1;
  }
  return true;
});

function handleStart() {
  if (!isValid.value) return;

  const config: SessionConfig = {
    name: name.value.trim(),
    studySubjectId: selectedSubjectId.value,
    mode: mode.value,
  };

  if (mode.value === TimerMode.CountDown) {
    config.durationMinutes = durationMinutes.value;
  }
  if (mode.value === TimerMode.Pomodoro) {
    config.workMinutes = workMins.value;
    config.shortBreakMinutes = shortBreakMins.value;
    config.longBreakMinutes = longBreakMins.value;
    config.cycles = cycles.value;
  }

  emit('start', config);
}
</script>

<style scoped>
.sheet-content {
  --padding-start: 24px;
  --padding-end: 24px;
  --padding-top: 0;
  --padding-bottom: 24px;
}

/* Drag handle */
.sheet-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--color-on-surface-variant);
  opacity: 0.25;
  margin: 14px auto;
}

/* Header */
.sheet-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.sheet-header__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: rgba(var(--ion-color-primary-rgb), 0.15);
  border-radius: 12px;
}

.sheet-header__icon ion-icon {
  font-size: 22px;
  color: var(--ion-color-primary);
}

.sheet-header__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0;
}

.sheet-header__subtitle {
  font-size: 13px;
  color: var(--color-on-surface-variant);
  margin: 2px 0 0;
}

/* Form inputs */
.form-field {
  margin-bottom: 10px;
}

.form-input {
  --background: var(--color-surface);
  --border-radius: 12px;
  --border-width: 1px;
  --border-color: var(--color-outline);
  --padding-start: 12px;
  --inner-padding-end: 12px;
  border: 1px solid var(--color-outline);
  border-radius: 12px;
}

.form-input__icon {
  font-size: 20px;
  color: var(--color-on-surface-variant);
  margin-right: 4px;
}

/* Timer mode section */
.form-section {
  margin-top: 16px;
}

.form-section__label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-on-surface-variant);
  margin-bottom: 8px;
}

/* Duration chips */
.duration-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--color-outline);
  background: var(--color-surface);
  color: var(--color-on-surface);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.chip--active {
  background: rgba(var(--ion-color-primary-rgb), 0.15);
  border-color: var(--ion-color-primary);
  color: var(--ion-color-primary);
  font-weight: 600;
}

/* Pomodoro card */
.pomodoro-card {
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-outline);
  overflow: hidden;
}

.pomodoro-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.pomodoro-row__label {
  font-size: 15px;
  color: var(--color-on-surface);
}

.pomodoro-row__controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pomodoro-row__value {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-on-surface);
  min-width: 48px;
  text-align: center;
}

.stepper-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--color-outline);
  background: var(--color-surface);
  color: var(--color-on-surface);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.stepper-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.pomodoro-divider {
  height: 1px;
  background: var(--color-outline-variant);
  margin: 0 16px;
}

/* Start button */
.start-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 52px;
  margin-top: 24px;
  border: none;
  border-radius: 14px;
  background: var(--ion-color-primary);
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.start-btn ion-icon {
  font-size: 20px;
}

.start-btn--disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
