<template>
  <ion-page>
    <AppHeader :title="isEditing ? 'Edit Plan' : 'New Plan'">
      <template #start>
        <ion-back-button default-href="/calendar" />
      </template>
      <template #end>
        <ion-button :strong="true" :disabled="!canSave" @click="save">
          Save
        </ion-button>
      </template>
    </AppHeader>

    <ion-content class="ion-padding">
      <!-- Name -->
      <ion-list>
        <ion-item>
          <ion-input
            v-model="formState.name"
            label="Plan Name"
            label-placement="stacked"
            placeholder="Enter plan name"
          />
        </ion-item>
      </ion-list>

      <!-- Color -->
      <div class="form-section">
        <p class="form-section__label">Color</p>
        <ColorPickerRow v-model="formState.color" />
      </div>

      <!-- Schedule Type -->
      <ion-list>
        <ion-item>
          <ion-select
            v-model="formState.scheduleType"
            label="Schedule"
            label-placement="stacked"
            interface="popover"
          >
            <ion-select-option value="daily">Daily</ion-select-option>
            <ion-select-option value="weekly">Weekly</ion-select-option>
            <ion-select-option value="interval">Every N days</ion-select-option>
            <ion-select-option value="monthly_dates">Monthly (dates)</ion-select-option>
            <ion-select-option value="monthly_weekday">Monthly (weekday)</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>

      <!-- Weekly days -->
      <div v-if="formState.scheduleType === 'weekly'" class="form-section">
        <p class="form-section__label">Days of the week</p>
        <div class="weekday-chips">
          <ion-chip
            v-for="(label, idx) in weekdayLabels"
            :key="idx"
            :color="formState.weeklyDays.includes(idx + 1) ? 'primary' : undefined"
            :outline="!formState.weeklyDays.includes(idx + 1)"
            @click="toggleWeekday(idx + 1)"
          >
            <ion-label>{{ label }}</ion-label>
          </ion-chip>
        </div>
      </div>

      <!-- Interval -->
      <ion-list v-if="formState.scheduleType === 'interval'">
        <ion-item>
          <ion-input
            v-model.number="formState.intervalEvery"
            label="Every N days"
            label-placement="stacked"
            type="number"
            :min="1"
            placeholder="2"
          />
        </ion-item>
      </ion-list>

      <!-- Monthly dates -->
      <div v-if="formState.scheduleType === 'monthly_dates'" class="form-section">
        <p class="form-section__label">Dates</p>
        <div class="date-grid">
          <ion-chip
            v-for="d in 31"
            :key="d"
            :color="formState.monthlyDates.includes(d) ? 'primary' : undefined"
            :outline="!formState.monthlyDates.includes(d)"
            class="date-grid__chip"
            @click="toggleMonthlyDate(d)"
          >
            <ion-label>{{ d }}</ion-label>
          </ion-chip>
        </div>
      </div>

      <!-- Monthly weekday -->
      <ion-list v-if="formState.scheduleType === 'monthly_weekday'">
        <ion-item>
          <ion-select
            v-model.number="formState.monthlyOccurrence"
            label="Occurrence"
            label-placement="stacked"
            interface="popover"
          >
            <ion-select-option :value="1">First</ion-select-option>
            <ion-select-option :value="2">Second</ion-select-option>
            <ion-select-option :value="3">Third</ion-select-option>
            <ion-select-option :value="4">Fourth</ion-select-option>
            <ion-select-option :value="5">Last</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item>
          <ion-select
            v-model.number="formState.monthlyWeekday"
            label="Weekday"
            label-placement="stacked"
            interface="popover"
          >
            <ion-select-option v-for="(label, idx) in weekdayLabels" :key="idx" :value="idx + 1">
              {{ label }}
            </ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>

      <!-- Start / End date -->
      <ion-list>
        <ion-item>
          <ion-label>Start Date</ion-label>
          <ion-datetime-button datetime="plan-start" />
        </ion-item>
        <ion-item>
          <ion-toggle v-model="formState.hasEndDate">End Date</ion-toggle>
        </ion-item>
        <ion-item v-if="formState.hasEndDate">
          <ion-label>End Date</ion-label>
          <ion-datetime-button datetime="plan-end" />
        </ion-item>
      </ion-list>

      <ion-modal :keep-contents-mounted="true">
        <ion-datetime
          id="plan-start"
          v-model="formState.startDate"
          presentation="date"
        />
      </ion-modal>

      <ion-modal v-if="formState.hasEndDate" :keep-contents-mounted="true">
        <ion-datetime
          id="plan-end"
          v-model="formState.endDate"
          presentation="date"
        />
      </ion-modal>

      <!-- Tasks -->
      <div class="form-section">
        <div class="form-section__header">
          <p class="form-section__label">Tasks</p>
          <ion-button fill="clear" size="small" @click="addTask">
            <ion-icon slot="start" :icon="mdiAdd" />
            Add
          </ion-button>
        </div>

        <div
          v-for="(task, idx) in formState.tasks"
          :key="idx"
          class="task-row"
        >
          <ion-input
            v-model="task.name"
            :placeholder="`Task ${idx + 1}`"
            class="task-row__input"
          />
          <ion-input
            v-model="task.startTime"
            placeholder="Start"
            type="time"
            class="task-row__time"
          />
          <ion-input
            v-model="task.endTime"
            placeholder="End"
            type="time"
            class="task-row__time"
          />
          <ion-button
            fill="clear"
            color="danger"
            size="small"
            :disabled="formState.tasks.length <= 1"
            @click="removeTask(idx)"
          >
            <ion-icon slot="icon-only" :icon="mdiDelete" />
          </ion-button>
        </div>
      </div>

      <!-- Validation error -->
      <p v-if="validationError" class="validation-error">{{ validationError }}</p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  IonPage,
  IonContent,
  IonBackButton,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonInput,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonChip,
  IonToggle,
  IonDatetimeButton,
  IonDatetime,
  IonModal,
} from '@ionic/vue';
import AppHeader from '@/shared/components/AppHeader.vue';
import { mdiAdd, mdiDelete } from '@/shared/icons/material';
import { useRoute } from 'vue-router';
import { useIonRouter } from '@ionic/vue';
import type { PlanFormState } from '@/features/calendar/utils/planFormState';
import { buildSchedule, parseSchedule, validatePlanForm } from '@/features/calendar/utils/planFormState';
import { toDateString } from '@/shared/utils/date';
import { usePlansQuery } from '@/features/calendar/composables/usePlansQuery';
import { useCreatePlanMutation } from '@/features/calendar/composables/useCreatePlanMutation';
import { useUpdatePlanMutation } from '@/features/calendar/composables/useUpdatePlanMutation';
import ColorPickerRow from '@/shared/components/ColorPickerRow.vue';

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const route = useRoute();
const ionRouter = useIonRouter();

const planId = computed(() => {
  const id = route.params.id;
  return id ? Number(id) : null;
});

const isEditing = computed(() => planId.value !== null);

const { data: plans } = usePlansQuery();
const createMutation = useCreatePlanMutation();
const updateMutation = useUpdatePlanMutation();

const formState = ref<PlanFormState>({
  name: '',
  color: null,
  scheduleType: 'daily',
  weeklyDays: [],
  intervalEvery: 2,
  monthlyDates: [],
  monthlyWeekday: 1,
  monthlyOccurrence: 1,
  startDate: toDateString(new Date()),
  hasEndDate: false,
  endDate: toDateString(new Date()),
  tasks: [{ name: '', startTime: '', endTime: '' }],
});

const validationError = ref<string | null>(null);

const canSave = computed(() => {
  return formState.value.name.trim().length > 0;
});

// Load existing plan data when editing
watch(
  [planId, plans],
  () => {
    if (!planId.value || !plans.value) return;
    const plan = plans.value.find((p) => p.id === planId.value);
    if (!plan) return;

    const scheduleState = parseSchedule(plan.schedule);

    formState.value = {
      name: plan.name,
      color: plan.color ?? null,
      scheduleType: scheduleState.scheduleType ?? 'daily',
      weeklyDays: scheduleState.weeklyDays ?? [],
      intervalEvery: scheduleState.intervalEvery ?? 2,
      monthlyDates: scheduleState.monthlyDates ?? [],
      monthlyWeekday: scheduleState.monthlyWeekday ?? 1,
      monthlyOccurrence: scheduleState.monthlyOccurrence ?? 1,
      startDate: plan.start_date,
      hasEndDate: !!plan.end_date,
      endDate: plan.end_date ?? toDateString(new Date()),
      tasks: plan.tasks.map((t) => ({
        id: t.id,
        name: t.name,
        startTime: t.start_time ?? '',
        endTime: t.end_time ?? '',
      })),
    };

    if (formState.value.tasks.length === 0) {
      formState.value.tasks = [{ name: '', startTime: '', endTime: '' }];
    }
  },
  { immediate: true },
);

function toggleWeekday(day: number) {
  const idx = formState.value.weeklyDays.indexOf(day);
  if (idx >= 0) {
    formState.value.weeklyDays.splice(idx, 1);
  } else {
    formState.value.weeklyDays.push(day);
  }
}

function toggleMonthlyDate(day: number) {
  const idx = formState.value.monthlyDates.indexOf(day);
  if (idx >= 0) {
    formState.value.monthlyDates.splice(idx, 1);
  } else {
    formState.value.monthlyDates.push(day);
  }
}

function addTask() {
  formState.value.tasks.push({ name: '', startTime: '', endTime: '' });
}

function removeTask(idx: number) {
  if (formState.value.tasks.length > 1) {
    formState.value.tasks.splice(idx, 1);
  }
}

function save() {
  const error = validatePlanForm(formState.value);
  if (error) {
    validationError.value = error;
    return;
  }
  validationError.value = null;

  const state = formState.value;
  const schedule = buildSchedule(state);

  // Extract date-only from ion-datetime values
  const startDate = state.startDate.substring(0, 10);
  const endDate = state.hasEndDate ? state.endDate.substring(0, 10) : undefined;

  const tasks = state.tasks
    .filter((t) => t.name.trim().length > 0)
    .map((t, idx) => ({
      ...(t.id !== undefined ? { id: t.id } : {}),
      name: t.name.trim(),
      sort_order: idx,
      start_time: t.startTime || undefined,
      end_time: t.endTime || undefined,
    }));

  if (isEditing.value && planId.value) {
    updateMutation.mutate(
      {
        id: planId.value,
        payload: {
          name: state.name.trim(),
          schedule,
          start_date: startDate,
          end_date: endDate,
          color: state.color ?? undefined,
          tasks,
        },
      },
      { onSuccess: () => ionRouter.back() },
    );
  } else {
    createMutation.mutate(
      {
        name: state.name.trim(),
        schedule,
        start_date: startDate,
        end_date: endDate,
        color: state.color ?? undefined,
        tasks: tasks.map(({ name, sort_order, start_time, end_time }) => ({
          name,
          sort_order,
          start_time,
          end_time,
        })),
      },
      { onSuccess: () => ionRouter.back() },
    );
  }
}
</script>

<style scoped>
.form-section {
  margin: 16px 0;
}

.form-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-section__label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-on-surface);
  margin: 0 0 8px;
}

.weekday-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.date-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.date-grid__chip {
  min-width: 40px;
  justify-content: center;
}

.task-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.task-row__input {
  flex: 2;
}

.task-row__time {
  flex: 1;
  --padding-start: 4px;
}

.validation-error {
  color: var(--ion-color-danger);
  font-size: 13px;
  margin-top: 12px;
  text-align: center;
}
</style>
