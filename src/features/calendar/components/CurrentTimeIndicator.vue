<template>
  <div
    v-if="visible"
    class="time-indicator"
    :style="{ top: `${yPosition}px`, left: `${TIME_GUTTER - 4}px` }"
  >
    <div class="time-indicator__circle" />
    <div class="time-indicator__line" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { toDateString } from '@/shared/utils/date';
import { PIXELS_PER_MINUTE, TIME_GUTTER, DAY_COUNT } from '@/features/calendar/utils/weekViewConstants';

const props = defineProps<{
  monday: Date;
}>();

const now = ref(new Date());
let timer: ReturnType<typeof globalThis.setInterval> | null = null;

onMounted(() => {
  timer = globalThis.setInterval(() => {
    now.value = new Date();
  }, 60_000);
});

onUnmounted(() => {
  if (timer) globalThis.clearInterval(timer);
});

const visible = computed(() => {
  const today = toDateString(now.value);
  for (let i = 0; i < DAY_COUNT; i++) {
    const d = new Date(props.monday);
    d.setDate(d.getDate() + i);
    if (toDateString(d) === today) return true;
  }
  return false;
});

const yPosition = computed(() => {
  const h = now.value.getHours();
  const m = now.value.getMinutes();
  return (h * 60 + m) * PIXELS_PER_MINUTE;
});
</script>

<style scoped>
.time-indicator {
  position: absolute;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.time-indicator__circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--ion-color-danger);
  flex-shrink: 0;
}

.time-indicator__line {
  height: 1.5px;
  flex: 1;
  background-color: var(--ion-color-danger);
}
</style>
