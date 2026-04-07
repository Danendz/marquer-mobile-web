<template>
  <div v-if="events.length > 0" class="all-day-row">
    <div class="all-day-row__label">All day</div>
    <div class="all-day-row__pills">
      <div
        v-for="(event, idx) in events"
        :key="idx"
        class="all-day-row__pill"
        :style="{ backgroundColor: event.color }"
      >
        {{ event.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WeekEvent } from '@/features/calendar/utils/weekEvent';

defineProps<{
  events: WeekEvent[];
}>();
</script>

<style scoped>
.all-day-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-bottom: 1px solid var(--color-surface-container);
  min-height: 32px;
  overflow-x: auto;
}

.all-day-row__label {
  font-size: 10px;
  color: var(--color-on-surface-variant);
  flex-shrink: 0;
  width: 36px;
}

.all-day-row__pills {
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;
}

.all-day-row__pill {
  font-size: 10px;
  font-weight: 500;
  color: #fff;
  padding: 2px 8px;
  border-radius: 10px;
  white-space: nowrap;
}
</style>
