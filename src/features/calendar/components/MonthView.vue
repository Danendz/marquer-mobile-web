<template>
  <div class="month-view">
    <!-- Month header -->
    <div class="month-view__header">
      <ion-button fill="clear" size="small" @click="prevMonth">
        <ion-icon slot="icon-only" :icon="mdiChevronLeft" />
      </ion-button>
      <span class="month-view__title">{{ monthLabel }}</span>
      <ion-button fill="clear" size="small" @click="nextMonth">
        <ion-icon slot="icon-only" :icon="mdiChevronRight" />
      </ion-button>
    </div>

    <!-- Weekday headers -->
    <div class="month-view__weekdays">
      <span v-for="wd in weekdays" :key="wd" class="month-view__weekday">{{ wd }}</span>
    </div>

    <!-- Day grid -->
    <div class="month-view__grid">
      <button
        v-for="(cell, idx) in cells"
        :key="idx"
        type="button"
        class="month-view__cell"
        :class="{
          'month-view__cell--outside': !cell.inMonth,
          'month-view__cell--today': cell.isToday,
          'month-view__cell--selected': cell.dateStr === selectedDateStr,
        }"
        @click="cell.inMonth && selectDay(cell.date)"
      >
        <span class="month-view__day-number">{{ cell.dayNumber }}</span>
        <div class="month-view__dots">
          <span v-if="cell.hasTasks" class="month-view__dot month-view__dot--tasks" />
          <span v-if="cell.hasCountdowns" class="month-view__dot month-view__dot--countdowns" />
          <span v-if="cell.hasPlans" class="month-view__dot month-view__dot--plans" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { IonButton, IonIcon } from '@ionic/vue';
import { mdiChevronLeft, mdiChevronRight } from '@/shared/icons/material';
import { toDateString } from '@/shared/utils/date';
import { useCalendarOverviewQuery } from '@/features/calendar/composables/useCalendarOverviewQuery';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const props = defineProps<{
  modelValue: Date;
}>();

const emit = defineEmits<{
  'update:modelValue': [date: Date];
}>();

const viewYear = ref(props.modelValue.getFullYear());
const viewMonth = ref(props.modelValue.getMonth()); // 0-based

const todayStr = computed(() => toDateString(new Date()));
const selectedDateStr = computed(() => toDateString(props.modelValue));

const monthLabel = computed(() => {
  const d = new Date(viewYear.value, viewMonth.value, 1);
  return d.toLocaleString('default', { month: 'long', year: 'numeric' });
});

// Query range: first visible day to last visible day of the grid
const fromDate = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1);
  const day = first.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  first.setDate(first.getDate() + offset);
  return toDateString(first);
});

const toDate = computed(() => {
  const last = new Date(viewYear.value, viewMonth.value + 1, 0);
  const day = last.getDay();
  const offset = day === 0 ? 0 : 7 - day;
  last.setDate(last.getDate() + offset);
  return toDateString(last);
});

const { data: overview } = useCalendarOverviewQuery(fromDate, toDate);

const taskDates = computed(() => new Set(overview.value?.tasks ?? []));
const planDates = computed(() => new Set(overview.value?.plan_tasks ?? []));

interface MonthCell {
  date: Date;
  dateStr: string;
  dayNumber: number;
  inMonth: boolean;
  isToday: boolean;
  hasTasks: boolean;
  hasCountdowns: boolean;
  hasPlans: boolean;
}

const cells = computed((): MonthCell[] => {
  const result: MonthCell[] = [];
  const first = new Date(viewYear.value, viewMonth.value, 1);
  const day = first.getDay();
  const startOffset = day === 0 ? -6 : 1 - day;
  const start = new Date(first);
  start.setDate(start.getDate() + startOffset);

  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dateStr = toDateString(d);
    const inMonth = d.getMonth() === viewMonth.value;

    result.push({
      date: new Date(d),
      dateStr,
      dayNumber: d.getDate(),
      inMonth,
      isToday: dateStr === todayStr.value,
      hasTasks: taskDates.value.has(dateStr),
      hasCountdowns: false, // overview only provides tasks and plan_tasks
      hasPlans: planDates.value.has(dateStr),
    });
  }

  return result;
});

function selectDay(date: Date) {
  emit('update:modelValue', date);
}

function prevMonth() {
  if (viewMonth.value === 0) {
    viewMonth.value = 11;
    viewYear.value--;
  } else {
    viewMonth.value--;
  }
}

function nextMonth() {
  if (viewMonth.value === 11) {
    viewMonth.value = 0;
    viewYear.value++;
  } else {
    viewMonth.value++;
  }
}
</script>

<style scoped>
.month-view {
  padding: 0 8px;
}

.month-view__header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 0;
}

.month-view__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-on-surface);
  min-width: 160px;
  text-align: center;
}

.month-view__weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  padding-bottom: 4px;
}

.month-view__weekday {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-on-surface-variant);
  text-transform: uppercase;
}

.month-view__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.month-view__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px 0;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  min-height: 48px;
}

.month-view__cell:active {
  background-color: var(--color-surface-container);
}

.month-view__cell--outside {
  opacity: 0.3;
}

.month-view__day-number {
  font-size: 14px;
  font-weight: 600;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.month-view__cell--today .month-view__day-number {
  background-color: rgba(var(--ion-color-primary-rgb), 0.15);
  color: var(--ion-color-primary);
  font-weight: 700;
}

.month-view__cell--selected .month-view__day-number {
  background-color: var(--ion-color-primary);
  color: var(--ion-color-primary-contrast, #fff);
}

.month-view__dots {
  display: flex;
  gap: 3px;
  height: 6px;
}

.month-view__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.month-view__dot--tasks {
  background-color: var(--ion-color-danger);
}

.month-view__dot--countdowns {
  background-color: var(--ion-color-primary);
}

.month-view__dot--plans {
  background-color: #f59e0b;
}
</style>
