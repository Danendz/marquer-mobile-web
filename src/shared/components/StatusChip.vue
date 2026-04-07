<template>
  <span class="status-chip" :class="`status-chip--${status}`">
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TaskStatus } from '@/features/tasks/types/tasks.types';

const props = defineProps<{
  status: TaskStatus;
}>();

const label = computed(() => {
  switch (props.status) {
    case TaskStatus.Done:
      return 'Done';
    case TaskStatus.Progress:
      return 'In Progress';
    case TaskStatus.Cancelled:
      return 'Cancelled';
    case TaskStatus.Draft:
    default:
      return 'Draft';
  }
});
</script>

<style scoped>
.status-chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;
}

.status-chip--done {
  background-color: rgba(22, 163, 74, 0.15);
  color: #16a34a;
}

.status-chip--progress {
  background-color: rgba(74, 122, 232, 0.15);
  color: #4a7ae8;
}

.status-chip--cancelled {
  background-color: rgba(220, 38, 38, 0.15);
  color: #dc2626;
}

.status-chip--draft {
  background-color: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}
</style>
