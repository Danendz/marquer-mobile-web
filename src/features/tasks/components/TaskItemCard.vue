<template>
  <div
    class="task-card"
    :style="{ '--task-color': taskColor }"
    @click="$emit('edit')"
    @long-press="openActions"
    @contextmenu.prevent="openActions"
  >
    <div class="task-card__row">
      <CircleCheckbox
        :checked="task.status === TaskStatus.Done"
        :color="taskColor"
        :disabled="isDeletedView"
        @toggle="$emit('toggle')"
      />
      <span
        class="task-card__name"
        :class="{ 'task-card__name--done': task.status === TaskStatus.Done }"
      >
        {{ task.name }}
      </span>
      <StatusChip :status="task.status" />
    </div>

    <div v-if="timeDisplay" class="task-card__detail">
      <ion-icon :icon="mdiSchedule" class="task-card__detail-icon" />
      <span>{{ timeDisplay }}</span>
      <span v-if="task.date" class="task-card__date">{{ formatDate(task.date) }}</span>
    </div>

    <div v-if="categoryName" class="task-card__detail">
      <ion-icon :icon="mdiFolder" class="task-card__detail-icon" />
      <span>{{ categoryName }}</span>
      <span
        v-if="categoryColor"
        class="task-card__category-dot"
        :style="{ backgroundColor: categoryColor }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonIcon } from '@ionic/vue';
import { mdiSchedule, mdiFolder } from '@/shared/icons/material';
import CircleCheckbox from '@/shared/components/CircleCheckbox.vue';
import StatusChip from '@/shared/components/StatusChip.vue';
import { formatTimeRange, formatDate } from '@/shared/utils/date';
import type { Task, TaskCategory } from '@/features/tasks/types/tasks.types';
import { TaskStatus } from '@/features/tasks/types/tasks.types';

const props = defineProps<{
  task: Task;
  category?: TaskCategory;
  isDeletedView?: boolean;
}>();

defineEmits<{
  toggle: [];
  edit: [];
  delete: [];
  restore: [];
  permanentDelete: [];
}>();

const taskColor = computed(() => props.task.color || 'var(--ion-color-primary)');

const timeDisplay = computed(() => formatTimeRange(props.task.start_time, props.task.end_time));

const categoryName = computed(() => props.category?.name);
const categoryColor = computed(() => props.category?.color);

function openActions() {
  // Action sheet will be handled by parent via emit
}
</script>

<style scoped>
.task-card {
  padding: 12px 16px;
  background: var(--color-surface);
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.task-card:active {
  background: var(--color-surface-container);
}

.task-card__row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-card__name {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-on-surface);
  line-height: 1.3;
}

.task-card__name--done {
  text-decoration: line-through;
  opacity: 0.5;
}

.task-card__detail {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-left: 36px;
  margin-top: 4px;
  font-size: 12px;
  color: var(--color-on-surface-variant);
}

.task-card__detail-icon {
  font-size: 14px;
}

.task-card__date {
  margin-left: auto;
}

.task-card__category-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
