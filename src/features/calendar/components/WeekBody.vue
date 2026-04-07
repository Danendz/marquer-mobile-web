<template>
  <div ref="scrollContainer" class="week-body">
    <AllDayRow :events="allDayEvents" />
    <div class="week-body__scroll" :style="{ height: `${totalHeight}px` }">
      <TimeGrid />
      <div class="week-body__columns">
        <DayColumn
          v-for="(day, idx) in days"
          :key="idx"
          :events="dayEvents(day.dateStr)"
          :column-width="colWidth"
          :date="day.dateStr"
        />
      </div>
      <CurrentTimeIndicator :monday="monday" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { toDateString } from '@/shared/utils/date';
import { useWeekDataQuery } from '@/features/calendar/composables/useWeekDataQuery';
import { PIXELS_PER_HOUR, DAY_COUNT } from '@/features/calendar/utils/weekViewConstants';
import {
  createTaskEvent,
  createPlanTaskEvent,
  createCountdownEvent,
} from '@/features/calendar/utils/weekEvent';
import type { WeekEvent } from '@/features/calendar/utils/weekEvent';
import TimeGrid from '@/features/calendar/components/TimeGrid.vue';
import DayColumn from '@/features/calendar/components/DayColumn.vue';
import AllDayRow from '@/features/calendar/components/AllDayRow.vue';
import CurrentTimeIndicator from '@/features/calendar/components/CurrentTimeIndicator.vue';

const props = defineProps<{
  monday: Date;
  selectedDate: Date;
}>();

defineEmits<{
  selectDate: [date: Date];
}>();

const scrollContainer = ref<globalThis.HTMLElement | null>(null);
const colWidth = ref(48);

const totalHeight = 24 * PIXELS_PER_HOUR;

const fromDate = computed(() => toDateString(props.monday));
const toDate = computed(() => {
  const end = new Date(props.monday);
  end.setDate(end.getDate() + 6);
  return toDateString(end);
});

const { data: weekData } = useWeekDataQuery(fromDate, toDate);

const days = computed(() => {
  const result: { date: Date; dateStr: string }[] = [];
  for (let i = 0; i < DAY_COUNT; i++) {
    const d = new Date(props.monday);
    d.setDate(d.getDate() + i);
    result.push({ date: new Date(d), dateStr: toDateString(d) });
  }
  return result;
});

const allEventsMap = computed(() => {
  const map: Record<string, WeekEvent[]> = {};
  if (!weekData.value) return map;

  const wd = weekData.value;

  // Tasks
  for (const [date, tasks] of Object.entries(wd.tasks)) {
    if (!map[date]) map[date] = [];
    for (const task of tasks) {
      map[date].push(createTaskEvent(task));
    }
  }

  // Plan tasks
  for (const [date, planTasks] of Object.entries(wd.plan_tasks)) {
    if (!map[date]) map[date] = [];
    for (const pt of planTasks) {
      map[date].push(createPlanTaskEvent(pt, date));
    }
  }

  // Countdowns
  for (const [date, countdowns] of Object.entries(wd.countdowns)) {
    if (!map[date]) map[date] = [];
    for (const cd of countdowns) {
      map[date].push(createCountdownEvent(cd));
    }
  }

  return map;
});

const allDayEvents = computed(() => {
  const result: WeekEvent[] = [];
  for (const events of Object.values(allEventsMap.value)) {
    for (const ev of events) {
      if (ev.isAllDay) result.push(ev);
    }
  }
  return result;
});

function dayEvents(dateStr: string): WeekEvent[] {
  return allEventsMap.value[dateStr] ?? [];
}

function scrollToCurrentTime() {
  if (!scrollContainer.value) return;
  const scrollEl = scrollContainer.value.querySelector('.week-body__scroll');
  if (!scrollEl) return;
  const now = new Date();
  const offset = Math.max(now.getHours() * PIXELS_PER_HOUR - 80, 0);
  scrollEl.scrollTop = offset;
}

function updateColWidth() {
  if (!scrollContainer.value) return;
  const availableWidth = scrollContainer.value.clientWidth - 44;
  colWidth.value = Math.floor(availableWidth / DAY_COUNT);
}

onMounted(() => {
  updateColWidth();
  scrollToCurrentTime();
});

watch(() => props.monday, () => {
  scrollToCurrentTime();
});
</script>

<style scoped>
.week-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.week-body__scroll {
  position: relative;
  display: flex;
  overflow-y: auto;
  flex: 1;
}

.week-body__columns {
  display: flex;
  flex: 1;
}
</style>
