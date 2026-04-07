<template>
  <ion-modal
    :is-open="isOpen"
    :initial-breakpoint="0.55"
    :breakpoints="[0, 0.55, 0.8]"
    @did-dismiss="$emit('dismiss')"
  >
    <div class="task-edit-sheet">
      <div class="task-edit-sheet__handle" />

      <h3 class="task-edit-sheet__title">Edit Task</h3>

      <ion-input
        v-model="name"
        label="Task name"
        label-placement="floating"
        class="ion-margin-bottom"
      />

      <label class="task-edit-sheet__label">Color</label>
      <ColorPickerRow v-model="color" />

      <label class="task-edit-sheet__label ion-margin-top">Time</label>
      <div class="task-edit-sheet__time-row">
        <ion-button fill="outline" size="small" @click="pickStartTime">
          <ion-icon slot="start" :icon="mdiSchedule" />
          {{ startTime || 'Start' }}
        </ion-button>
        <ion-icon :icon="mdiArrowForwardIos" class="task-edit-sheet__arrow" />
        <ion-button
          fill="outline"
          size="small"
          :disabled="!startTime"
          @click="pickEndTime"
        >
          {{ endTime || 'End' }}
        </ion-button>
        <ion-button
          v-if="startTime"
          fill="clear"
          size="small"
          @click="clearTimes"
        >
          <ion-icon :icon="mdiClose" />
        </ion-button>
      </div>

      <ion-button expand="block" class="ion-margin-top" @click="handleSave">
        Save
      </ion-button>
    </div>

    <!-- Start time picker -->
    <ion-modal
      :is-open="showStartPicker"
      :initial-breakpoint="0.45"
      :breakpoints="[0, 0.45]"
      @did-dismiss="showStartPicker = false"
    >
      <ion-datetime
        presentation="time"
        :value="startTimeValue"
        :show-default-buttons="true"
        @ion-change="onStartTimeChange"
      />
    </ion-modal>

    <!-- End time picker -->
    <ion-modal
      :is-open="showEndPicker"
      :initial-breakpoint="0.45"
      :breakpoints="[0, 0.45]"
      @did-dismiss="showEndPicker = false"
    >
      <ion-datetime
        presentation="time"
        :value="endTimeValue"
        :show-default-buttons="true"
        @ion-change="onEndTimeChange"
      />
    </ion-modal>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { IonModal, IonInput, IonButton, IonIcon, IonDatetime } from '@ionic/vue';
import { mdiSchedule, mdiArrowForwardIos, mdiClose } from '@/shared/icons/material';
import ColorPickerRow from '@/shared/components/ColorPickerRow.vue';
import type { Task } from '@/features/tasks/types/tasks.types';

const props = defineProps<{
  isOpen: boolean;
  task: Task;
}>();

const emit = defineEmits<{
  dismiss: [];
  save: [payload: {
    name: string;
    start_time?: string;
    end_time?: string;
    color?: string;
    clear_start_time?: boolean;
    clear_end_time?: boolean;
    clear_color?: boolean;
  }];
}>();

const name = ref('');
const color = ref<string | null>(null);
const startTime = ref<string | null>(null);
const endTime = ref<string | null>(null);
const showStartPicker = ref(false);
const showEndPicker = ref(false);

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      name.value = props.task.name;
      color.value = props.task.color ?? null;
      startTime.value = props.task.start_time ?? null;
      endTime.value = props.task.end_time ?? null;
    }
  },
);

const startTimeValue = ref<string | undefined>(undefined);
const endTimeValue = ref<string | undefined>(undefined);

function pickStartTime() {
  startTimeValue.value = startTime.value
    ? `2024-01-01T${startTime.value}:00`
    : undefined;
  showStartPicker.value = true;
}

function pickEndTime() {
  endTimeValue.value = endTime.value
    ? `2024-01-01T${endTime.value}:00`
    : undefined;
  showEndPicker.value = true;
}

function onStartTimeChange(e: globalThis.CustomEvent) {
  const val = e.detail.value as string;
  const time = val.slice(11, 16); // Extract HH:MM from ISO
  startTime.value = time;
  showStartPicker.value = false;

  // Auto-adjust: set end to start + 60min, clamped to 23:59
  if (!endTime.value) {
    const [h, m] = time.split(':').map(Number);
    let endH = h + 1;
    let endM = m;
    if (endH > 23) {
      endH = 23;
      endM = 59;
    }
    endTime.value = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }
}

function onEndTimeChange(e: globalThis.CustomEvent) {
  const val = e.detail.value as string;
  const time = val.slice(11, 16);

  // Validate: end must be > start
  if (startTime.value && time <= startTime.value) return;

  endTime.value = time;
  showEndPicker.value = false;
}

function clearTimes() {
  startTime.value = null;
  endTime.value = null;
}

function handleSave() {
  const hadStartTime = !!props.task.start_time;
  const hadEndTime = !!props.task.end_time;
  const hadColor = !!props.task.color;

  emit('save', {
    name: name.value,
    start_time: startTime.value ?? undefined,
    end_time: endTime.value ?? undefined,
    color: color.value ?? undefined,
    clear_start_time: hadStartTime && !startTime.value,
    clear_end_time: hadEndTime && !endTime.value,
    clear_color: hadColor && !color.value,
  });
}
</script>

<style scoped>
.task-edit-sheet {
  padding: 16px;
}

.task-edit-sheet__handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--color-outline);
  margin: 0 auto 16px;
}

.task-edit-sheet__title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px;
}

.task-edit-sheet__label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-on-surface-variant);
  margin-bottom: 4px;
}

.task-edit-sheet__time-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-edit-sheet__arrow {
  color: var(--color-on-surface-variant);
  font-size: 16px;
}
</style>
