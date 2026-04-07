<template>
  <div class="day-column" :style="{ width: `${columnWidth}px` }">
    <!-- Plan group backgrounds -->
    <div
      v-for="(group, gIdx) in planGroups"
      :key="'g-' + gIdx"
      class="day-column__plan-bg"
      :style="{
        top: `${group.startMinutes * PIXELS_PER_MINUTE}px`,
        height: `${group.durationMinutes * PIXELS_PER_MINUTE}px`,
        backgroundColor: group.color,
      }"
    />

    <!-- Timed events -->
    <div
      v-for="(pe, idx) in positioned"
      :key="idx"
      class="day-column__event"
      :class="{ 'day-column__event--done': pe.event.isDone }"
      :style="{
        top: `${pe.event.startMinutes * PIXELS_PER_MINUTE}px`,
        height: `${Math.max(pe.event.durationMinutes * PIXELS_PER_MINUTE, 16)}px`,
        left: `${pe.left}px`,
        width: `${pe.width - 2}px`,
        backgroundColor: pe.event.color,
      }"
    >
      <span class="day-column__event-name">{{ pe.event.name }}</span>
      <span v-if="pe.overflowCount > 0" class="day-column__overflow">
        +{{ pe.overflowCount }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { WeekEvent } from '@/features/calendar/utils/weekEvent';
import { layoutEvents } from '@/features/calendar/utils/eventLayout';
import { PIXELS_PER_MINUTE } from '@/features/calendar/utils/weekViewConstants';

const props = defineProps<{
  events: WeekEvent[];
  columnWidth: number;
  date: string;
}>();

const timedEvents = computed(() => props.events.filter((e) => !e.isAllDay));

const positioned = computed(() => layoutEvents(timedEvents.value, props.columnWidth));

const planGroups = computed(() => {
  const groups: { startMinutes: number; durationMinutes: number; color: string }[] = [];
  for (const ev of timedEvents.value) {
    if (ev.type === 'planTask') {
      groups.push({
        startMinutes: ev.startMinutes,
        durationMinutes: ev.durationMinutes,
        color: ev.color.startsWith('var(') ? 'rgba(var(--ion-color-primary-rgb), 0.08)' : `${ev.color}15`,
      });
    }
  }
  return groups;
});
</script>

<style scoped>
.day-column {
  position: relative;
  height: 100%;
  border-left: 1px solid var(--color-surface-container);
}

.day-column__plan-bg {
  position: absolute;
  left: 0;
  right: 0;
  border-radius: 4px;
  pointer-events: none;
}

.day-column__event {
  position: absolute;
  border-radius: 4px;
  padding: 2px 4px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.9;
}

.day-column__event--done {
  opacity: 0.4;
}

.day-column__event-name {
  display: block;
  font-size: 10px;
  font-weight: 500;
  color: #fff;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.day-column__overflow {
  position: absolute;
  top: 2px;
  right: 4px;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 0 3px;
}
</style>
