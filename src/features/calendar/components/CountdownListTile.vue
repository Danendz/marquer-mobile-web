<template>
  <div
    class="countdown-tile"
    :class="{ 'countdown-tile--past': isPast }"
    @click="$emit('click')"
  >
    <img
      :src="timerBgUrl(countdown.bg_image)"
      alt=""
      class="countdown-tile__image"
    />
    <div class="countdown-tile__info">
      <span class="countdown-tile__name">{{ countdown.name }}</span>
      <span class="countdown-tile__label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Countdown } from '@/features/calendar/types/calendar.types';
import { daysUntil, daysLabel } from '@/shared/utils/date';
import { timerBgUrl } from '@/shared/constants/timerBackgrounds';

const props = defineProps<{
  countdown: Countdown;
}>();

defineEmits<{
  click: [];
}>();

const days = computed(() => daysUntil(props.countdown.target_date));
const label = computed(() => daysLabel(days.value));
const isPast = computed(() => days.value < 0);
</script>

<style scoped>
.countdown-tile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  cursor: pointer;
}

.countdown-tile--past {
  opacity: 0.5;
}

.countdown-tile__image {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.countdown-tile__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.countdown-tile__name {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-on-surface);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.countdown-tile__label {
  font-size: 13px;
  color: var(--color-on-surface-variant);
}
</style>
