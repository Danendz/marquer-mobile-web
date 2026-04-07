<template>
  <div class="progress-ring" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg :width="size" :height="size" class="progress-ring__svg">
      <!-- Background ring -->
      <circle
        class="progress-ring__bg"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidth"
        fill="none"
      />
      <!-- Progress ring -->
      <circle
        class="progress-ring__progress"
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke-width="strokeWidth"
        :stroke="color"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        fill="none"
        stroke-linecap="round"
      />
    </svg>
    <div class="progress-ring__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
  }>(),
  {
    size: 240,
    strokeWidth: 8,
    color: 'var(--ion-color-primary)',
  },
);

const center = computed(() => props.size / 2);
const radius = computed(() => (props.size - props.strokeWidth) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const dashOffset = computed(() => circumference.value * (1 - Math.min(Math.max(props.progress, 0), 1)));
</script>

<style scoped>
.progress-ring {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.progress-ring__svg {
  transform: rotate(-90deg);
  position: absolute;
  inset: 0;
}

.progress-ring__bg {
  stroke: rgba(255, 255, 255, 0.15);
}

.progress-ring__progress {
  transition: stroke-dashoffset 0.3s ease;
}

.progress-ring__content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
