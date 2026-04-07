<template>
  <div class="day-event-list">
    <template v-if="isLoading">
      <ion-spinner name="dots" class="day-event-list__spinner" />
    </template>

    <template v-else-if="tasks && tasks.length > 0">
      <DayEventTile
        v-for="task in tasks"
        :key="task.id"
        :task="task"
      />
    </template>

    <p v-else class="day-event-list__empty">No events for this day</p>

    <button type="button" class="day-event-list__add-btn" @click="$emit('add')">
      <ion-icon :icon="mdiAdd" />
      <span>Add Event</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonSpinner, IonIcon } from '@ionic/vue';
import { mdiAdd } from '@/shared/icons/material';
import DayEventTile from '@/features/calendar/components/DayEventTile.vue';
import { useTasksQuery } from '@/features/tasks/composables/useTasksQuery';

const props = defineProps<{
  date: string;
}>();

defineEmits<{
  add: [];
}>();

const queryParams = computed(() => ({ date: props.date }));
const { data: tasks, isLoading } = useTasksQuery(queryParams);
</script>

<style scoped>
.day-event-list {
  padding: 4px 0;
}

.day-event-list__spinner {
  display: block;
  margin: 16px auto;
}

.day-event-list__empty {
  font-size: 14px;
  color: var(--color-on-surface-variant);
  text-align: center;
  padding: 20px 0;
}

.day-event-list__add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px 16px;
  margin-top: 4px;
  border: 1px solid var(--color-outline);
  border-radius: 12px;
  background: transparent;
  color: var(--ion-color-primary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.day-event-list__add-btn ion-icon {
  font-size: 18px;
}
</style>
