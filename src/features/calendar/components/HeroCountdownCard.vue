<template>
  <div
    class="hero-countdown"
    :class="{ 'hero-countdown--past': isPast }"
    @click="$emit('click')"
  >
    <img
      :src="timerBgUrl(countdown.bg_image)"
      alt=""
      class="hero-countdown__bg"
    />
    <div class="hero-countdown__gradient" />
    <div class="hero-countdown__content">
      <span class="hero-countdown__days">{{ Math.abs(days) }}</span>
      <span class="hero-countdown__label">{{ label }}</span>
      <span class="hero-countdown__name">{{ countdown.name }}</span>
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
.hero-countdown {
  position: relative;
  width: 100%;
  height: 220px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
}

.hero-countdown--past {
  opacity: 0.6;
}

.hero-countdown__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-countdown__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.1) 60%);
}

.hero-countdown__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  padding: 16px;
}

.hero-countdown__days {
  font-size: 42px;
  font-weight: 800;
  line-height: 1;
}

.hero-countdown__label {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
  margin-top: 4px;
}

.hero-countdown__name {
  font-size: 18px;
  font-weight: 600;
  margin-top: 12px;
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
