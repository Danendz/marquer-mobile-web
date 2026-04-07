<template>
  <ion-modal
    :is-open="isOpen"
    :initial-breakpoint="0.6"
    :breakpoints="[0, 0.6, 0.85]"
    @did-dismiss="$emit('close')"
  >
    <ion-content class="sheet-content">
      <div class="sheet-handle" />

      <h3 class="sheet-title">Add Event</h3>

      <!-- Name input -->
      <div class="form-field">
        <ion-item lines="none" class="form-input">
          <ion-input
            v-model="name"
            label="Event name"
            label-placement="floating"
            placeholder="What's happening?"
          />
        </ion-item>
      </div>

      <!-- Color picker -->
      <div class="form-field">
        <span class="form-label">Color</span>
        <ColorPickerRow v-model="color" />
      </div>

      <!-- Time pickers -->
      <div class="form-field">
        <span class="form-label">Time</span>
        <div class="time-row">
          <button type="button" class="time-btn" @click="showStartPicker = true">
            <ion-icon :icon="mdiSchedule" />
            <span>{{ startTimeLabel }}</span>
          </button>
          <button
            type="button"
            class="time-btn"
            :class="{ 'time-btn--disabled': !startTime }"
            :disabled="!startTime"
            @click="showEndPicker = true"
          >
            <ion-icon :icon="mdiSchedule" />
            <span>{{ endTimeLabel }}</span>
          </button>
          <button
            v-if="startTime"
            type="button"
            class="time-clear-btn"
            @click="clearTime"
          >
            <ion-icon :icon="mdiClose" />
          </button>
        </div>
      </div>

      <!-- Save button -->
      <button
        type="button"
        class="save-btn"
        :class="{ 'save-btn--disabled': !canSave }"
        :disabled="!canSave"
        @click="save"
      >
        Save
      </button>

      <!-- Start time picker modal -->
      <ion-modal
        :is-open="showStartPicker"
        :initial-breakpoint="0.45"
        :breakpoints="[0, 0.45]"
        @did-dismiss="showStartPicker = false"
      >
        <ion-datetime
          :value="startTimeValue"
          presentation="time"
          :show-default-buttons="true"
          @ion-change="onStartTimeChange"
        />
      </ion-modal>

      <!-- End time picker modal -->
      <ion-modal
        :is-open="showEndPicker"
        :initial-breakpoint="0.45"
        :breakpoints="[0, 0.45]"
        @did-dismiss="showEndPicker = false"
      >
        <ion-datetime
          :value="endTimeValue"
          presentation="time"
          :show-default-buttons="true"
          @ion-change="onEndTimeChange"
        />
      </ion-modal>
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
  IonIcon,
  IonDatetime,
} from '@ionic/vue';
import { mdiSchedule, mdiClose } from '@/shared/icons/material';
import ColorPickerRow from '@/shared/components/ColorPickerRow.vue';
import { useCreateTaskMutation } from '@/features/tasks/composables/useCreateTaskMutation';
import { useQueryClient } from '@tanstack/vue-query';

const props = defineProps<{
  isOpen: boolean;
  date: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const queryClient = useQueryClient();
const createMutation = useCreateTaskMutation();

const name = ref('');
const color = ref<string | null>(null);
const startTime = ref<string | null>(null);
const endTime = ref<string | null>(null);
const showStartPicker = ref(false);
const showEndPicker = ref(false);

// ion-datetime v-model values
const startTimeValue = ref('08:00');
const endTimeValue = ref('09:00');

const canSave = computed(() => name.value.trim().length > 0);

const startTimeLabel = computed(() => startTime.value || 'Start time');
const endTimeLabel = computed(() => endTime.value || 'End time');

// Reset when sheet opens
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      name.value = '';
      color.value = null;
      startTime.value = null;
      endTime.value = null;
      startTimeValue.value = '08:00';
      endTimeValue.value = '09:00';
    }
  },
);

function extractTime(val: string): string {
  return val.includes('T') ? val.split('T')[1].substring(0, 5) : val.substring(0, 5);
}

function onStartTimeChange(e: globalThis.CustomEvent) {
  const val = e.detail.value as string;
  const time = extractTime(val);
  startTime.value = time;
  startTimeValue.value = val;
  showStartPicker.value = false;

  // Auto-set end time to +1 hour if not set or if before start
  if (!endTime.value || endTime.value <= time) {
    const [h, m] = time.split(':').map(Number);
    const endH = Math.min(h + 1, 23);
    const endStr = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    endTime.value = endStr;
    endTimeValue.value = endStr;
  }
}

function onEndTimeChange(e: globalThis.CustomEvent) {
  const val = e.detail.value as string;
  const time = extractTime(val);

  // Don't allow end before start
  if (startTime.value && time <= startTime.value) return;

  endTime.value = time;
  endTimeValue.value = val;
  showEndPicker.value = false;
}

function clearTime() {
  startTime.value = null;
  endTime.value = null;
}

function save() {
  if (!canSave.value) return;

  createMutation.mutate(
    {
      name: name.value.trim(),
      date: props.date,
      color: color.value ?? undefined,
      start_time: startTime.value ?? undefined,
      end_time: endTime.value ?? undefined,
    },
    {
      onSuccess: () => {
        // Also invalidate calendar overview to update dots
        queryClient.invalidateQueries({ queryKey: ['calendar'] });
        emit('close');
      },
    },
  );
}
</script>

<style scoped>
.sheet-content {
  --padding-start: 24px;
  --padding-end: 24px;
  --padding-top: 0;
  --padding-bottom: 24px;
}

.sheet-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--color-on-surface-variant);
  opacity: 0.25;
  margin: 14px auto;
}

.sheet-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-on-surface);
  margin: 0 0 16px;
}

.form-field {
  margin-bottom: 14px;
}

.form-input {
  --background: var(--color-surface);
  --border-radius: 12px;
  border: 1px solid var(--color-outline);
  border-radius: 12px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-on-surface-variant);
  margin-bottom: 6px;
}

.time-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.time-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--color-outline);
  border-radius: 12px;
  background: var(--color-surface);
  color: var(--color-on-surface);
  font-size: 13px;
  cursor: pointer;
}

.time-btn ion-icon {
  font-size: 16px;
  color: var(--color-on-surface-variant);
}

.time-btn--disabled {
  opacity: 0.4;
  cursor: default;
}

.time-clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-on-surface-variant);
  font-size: 18px;
  cursor: pointer;
}

.save-btn {
  width: 100%;
  height: 48px;
  margin-top: 8px;
  border: none;
  border-radius: 14px;
  background: var(--ion-color-primary);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.save-btn--disabled {
  opacity: 0.5;
  cursor: default;
}
</style>
