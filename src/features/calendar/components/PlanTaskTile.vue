<template>
  <div class="plan-task-tile">
    <CircleCheckbox
      :checked="task.is_completed"
      :color="'var(--ion-color-primary)'"
      @toggle="toggle"
    />
    <div class="plan-task-tile__info">
      <span
        class="plan-task-tile__name"
        :class="{ 'plan-task-tile__name--done': task.is_completed }"
      >
        {{ task.name }}
      </span>
      <span v-if="timeRange" class="plan-task-tile__time">{{ timeRange }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PlanTaskForDate } from '@/features/calendar/types/calendar.types';
import CircleCheckbox from '@/shared/components/CircleCheckbox.vue';
import { useTogglePlanTaskMutation } from '@/features/calendar/composables/useTogglePlanTaskMutation';
import { formatTimeRange } from '@/shared/utils/date';

const props = defineProps<{
  task: PlanTaskForDate;
  planId: number;
  date: string;
}>();

const toggleMutation = useTogglePlanTaskMutation();

const timeRange = computed(() => formatTimeRange(props.task.start_time, props.task.end_time));

function toggle() {
  toggleMutation.mutate({ planTaskId: props.task.id, date: props.date });
}
</script>

<style scoped>
.plan-task-tile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
}

.plan-task-tile__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.plan-task-tile__name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-on-surface);
}

.plan-task-tile__name--done {
  text-decoration: line-through;
  opacity: 0.5;
}

.plan-task-tile__time {
  font-size: 12px;
  color: var(--color-on-surface-variant);
}
</style>
