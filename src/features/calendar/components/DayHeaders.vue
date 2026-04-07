<template>
  <div class="day-headers">
    <div :style="{ width: `${TIME_GUTTER}px` }" class="day-headers__gutter" />
    <button
      v-for="(day, idx) in days"
      :key="idx"
      type="button"
      class="day-headers__cell"
      :class="{
        'day-headers__cell--selected': day.dateStr === selectedDateStr,
        'day-headers__cell--today': day.isToday,
      }"
      @click="emit('selectDate', day.date)"
    >
      <span class="day-headers__weekday">{{ day.weekday }}</span>
      <span class="day-headers__number">{{ day.dayNumber }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { toDateString } from '@/shared/utils/date';
import { TIME_GUTTER, DAY_COUNT } from '@/features/calendar/utils/weekViewConstants';

const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const props = defineProps<{
  monday: Date;
  selectedDate: Date;
}>();

const emit = defineEmits<{
  selectDate: [date: Date];
}>();

const todayStr = computed(() => toDateString(new Date()));
const selectedDateStr = computed(() => toDateString(props.selectedDate));

const days = computed(() => {
  const result: {
    date: Date;
    dateStr: string;
    weekday: string;
    dayNumber: number;
    isToday: boolean;
  }[] = [];

  for (let i = 0; i < DAY_COUNT; i++) {
    const d = new Date(props.monday);
    d.setDate(d.getDate() + i);
    const dateStr = toDateString(d);
    result.push({
      date: new Date(d),
      dateStr,
      weekday: weekdayNames[i],
      dayNumber: d.getDate(),
      isToday: dateStr === todayStr.value,
    });
  }

  return result;
});
</script>

<style scoped>
.day-headers {
  display: flex;
  border-bottom: 1px solid var(--color-surface-container);
}

.day-headers__gutter {
  flex-shrink: 0;
}

.day-headers__cell {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 0;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.15s ease;
}

.day-headers__cell:active {
  background-color: var(--color-surface-container);
}

.day-headers__weekday {
  font-size: 11px;
  color: var(--color-on-surface-variant);
  text-transform: uppercase;
  font-weight: 500;
}

.day-headers__number {
  font-size: 14px;
  font-weight: 600;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.day-headers__cell--today .day-headers__number {
  color: var(--ion-color-primary);
}

.day-headers__cell--selected .day-headers__number {
  background-color: var(--ion-color-primary);
  color: var(--ion-color-primary-contrast, #fff);
}
</style>
