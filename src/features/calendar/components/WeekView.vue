<template>
  <div class="week-view">
    <!-- Navigation header -->
    <div class="week-view__nav">
      <ion-button fill="clear" size="small" @click="prevWeek">
        <ion-icon slot="icon-only" :icon="mdiChevronLeft" />
      </ion-button>
      <button type="button" class="week-view__title" @click="goToToday">
        {{ weekLabel }}
      </button>
      <ion-button fill="clear" size="small" @click="nextWeek">
        <ion-icon slot="icon-only" :icon="mdiChevronRight" />
      </ion-button>
    </div>

    <DayHeaders
      :monday="monday"
      :selected-date="selectedDate"
      @select-date="onSelectDate"
    />

    <WeekBody
      :monday="monday"
      :selected-date="selectedDate"
      @select-date="onSelectDate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';
import { mdiChevronLeft, mdiChevronRight } from '@/shared/icons/material';
import { mondayOf } from '@/shared/utils/date';
import DayHeaders from '@/features/calendar/components/DayHeaders.vue';
import WeekBody from '@/features/calendar/components/WeekBody.vue';

const props = defineProps<{
  modelValue: Date;
}>();

const emit = defineEmits<{
  'update:modelValue': [date: Date];
}>();

const monday = ref(mondayOf(props.modelValue));
const selectedDate = ref(new Date(props.modelValue));

const weekLabel = computed(() => {
  const start = monday.value;
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  const startMonth = start.toLocaleString('default', { month: 'short' });
  const endMonth = end.toLocaleString('default', { month: 'short' });

  if (startMonth === endMonth) {
    return `${start.getDate()} - ${end.getDate()} ${startMonth} ${start.getFullYear()}`;
  }
  return `${start.getDate()} ${startMonth} - ${end.getDate()} ${endMonth} ${start.getFullYear()}`;
});

function onSelectDate(date: Date) {
  selectedDate.value = date;
  emit('update:modelValue', date);
}

function prevWeek() {
  const prev = new Date(monday.value);
  prev.setDate(prev.getDate() - 7);
  monday.value = prev;

  // Keep same weekday
  const dayOffset = getDayOffset(selectedDate.value);
  const newSelected = new Date(prev);
  newSelected.setDate(prev.getDate() + dayOffset);
  selectedDate.value = newSelected;
  emit('update:modelValue', newSelected);
}

function nextWeek() {
  const next = new Date(monday.value);
  next.setDate(next.getDate() + 7);
  monday.value = next;

  const dayOffset = getDayOffset(selectedDate.value);
  const newSelected = new Date(next);
  newSelected.setDate(next.getDate() + dayOffset);
  selectedDate.value = newSelected;
  emit('update:modelValue', newSelected);
}

function goToToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  monday.value = mondayOf(today);
  selectedDate.value = today;
  emit('update:modelValue', today);
}

function getDayOffset(date: Date): number {
  const day = date.getDay(); // 0=Sun
  return day === 0 ? 6 : day - 1;
}
</script>

<style scoped>
.week-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.week-view__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 8px;
}

.week-view__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-on-surface);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}

.week-view__title:active {
  background: var(--color-surface-container);
}
</style>
