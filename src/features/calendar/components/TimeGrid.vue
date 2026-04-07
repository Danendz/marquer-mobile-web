<template>
  <div class="time-grid" :style="{ width: `${TIME_GUTTER}px`, height: `${totalHeight}px` }">
    <div
      v-for="hour in 24"
      :key="hour - 1"
      class="time-grid__label"
      :style="{ top: `${(hour - 1) * PIXELS_PER_HOUR}px` }"
    >
      {{ formatHour(hour - 1) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { PIXELS_PER_HOUR, TIME_GUTTER } from '@/features/calendar/utils/weekViewConstants';

const totalHeight = 24 * PIXELS_PER_HOUR;

function formatHour(h: number): string {
  return `${String(h).padStart(2, '0')}:00`;
}
</script>

<style scoped>
.time-grid {
  position: relative;
  flex-shrink: 0;
}

.time-grid__label {
  position: absolute;
  left: 0;
  width: 100%;
  font-size: 10px;
  color: var(--color-on-surface-variant);
  text-align: right;
  padding-right: 6px;
  transform: translateY(-6px);
  line-height: 1;
  user-select: none;
}
</style>
