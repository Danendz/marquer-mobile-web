<template>
  <div
    class="day-event-tile"
    :class="{ 'day-event-tile--done': isDone }"
  >
    <CircleCheckbox
      :checked="isDone"
      :color="task.color || 'var(--ion-color-primary)'"
      @toggle="toggleStatus"
    />
    <span class="day-event-tile__name">{{ task.name }}</span>
    <span v-if="timeRange" class="day-event-tile__time">
      <ion-icon :icon="mdiSchedule" class="day-event-tile__time-icon" />
      {{ timeRange }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonIcon } from '@ionic/vue';
import { mdiSchedule } from '@/shared/icons/material';
import type { Task } from '@/features/tasks/types/tasks.types';
import { TaskStatus } from '@/features/tasks/types/tasks.types';
import CircleCheckbox from '@/shared/components/CircleCheckbox.vue';
import { useUpdateTaskMutation } from '@/features/tasks/composables/useUpdateTaskMutation';
import { formatTimeRange } from '@/shared/utils/date';

const props = defineProps<{
  task: Task;
}>();

const updateMutation = useUpdateTaskMutation();

const isDone = computed(() => props.task.status === TaskStatus.Done);
const timeRange = computed(() => formatTimeRange(props.task.start_time, props.task.end_time));

function toggleStatus() {
  updateMutation.mutate({
    id: props.task.id,
    payload: {
      status: isDone.value ? TaskStatus.Progress : TaskStatus.Done,
    },
  });
}
</script>

<style scoped>
.day-event-tile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: var(--color-surface-container);
  border-radius: 12px;
  margin-bottom: 6px;
}

.day-event-tile__name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-on-surface);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.day-event-tile--done .day-event-tile__name {
  text-decoration: line-through;
  opacity: 0.5;
}

.day-event-tile__time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-on-surface-variant);
  white-space: nowrap;
}

.day-event-tile__time-icon {
  font-size: 14px;
}
</style>
