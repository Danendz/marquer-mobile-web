<template>
  <div class="day-plan-list">
    <template v-if="isLoading">
      <ion-spinner name="dots" />
    </template>

    <template v-else-if="plans && plans.length > 0">
      <div v-for="plan in plans" :key="plan.id" class="day-plan-list__plan">
        <div class="day-plan-list__header">
          <span
            v-if="plan.color"
            class="day-plan-list__color"
            :style="{ backgroundColor: plan.color }"
          />
          <span class="day-plan-list__name">{{ plan.name }}</span>
        </div>
        <PlanTaskTile
          v-for="task in plan.tasks"
          :key="task.id"
          :task="task"
          :plan-id="plan.id"
          :date="date"
        />
      </div>
    </template>

    <p v-else class="day-plan-list__empty">No plans for this day</p>
  </div>
</template>

<script setup lang="ts">
import { IonSpinner } from '@ionic/vue';
import { usePlansForDateQuery } from '@/features/calendar/composables/usePlansForDateQuery';
import PlanTaskTile from '@/features/calendar/components/PlanTaskTile.vue';

const props = defineProps<{
  date: string;
}>();

const { data: plans, isLoading } = usePlansForDateQuery(() => props.date);
</script>

<style scoped>
.day-plan-list {
  padding: 8px 0;
}

.day-plan-list__plan {
  margin-bottom: 12px;
}

.day-plan-list__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.day-plan-list__color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.day-plan-list__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-on-surface);
}

.day-plan-list__empty {
  font-size: 13px;
  color: var(--color-on-surface-variant);
  text-align: center;
  padding: 16px 0;
}
</style>
