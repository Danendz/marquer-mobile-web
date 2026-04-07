<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title slot="start" class="calendar-title">Calendar</ion-title>
        <ion-buttons slot="end">
          <ion-button v-if="activeTab === 'calendar'" @click="toggleView">
            <ion-icon slot="icon-only" :icon="viewIcon" />
          </ion-button>
          <ion-button v-if="activeTab === 'countdown'" @click="showCountdownForm = true">
            <ion-icon slot="icon-only" :icon="mdiAdd" />
          </ion-button>
          <ion-button v-if="activeTab === 'plans'" @click="navigateToPlanForm()">
            <ion-icon slot="icon-only" :icon="mdiAdd" />
          </ion-button>
        </ion-buttons>
        <div slot="end" class="header-segment">
          <ion-segment v-model="activeTab">
            <ion-segment-button value="calendar">
              <ion-icon :icon="mdiCalendarMonth" />
            </ion-segment-button>
            <ion-segment-button value="countdown">
              <ion-icon :icon="mdiTimer" />
            </ion-segment-button>
            <ion-segment-button value="plans">
              <ion-icon :icon="mdiChecklist" />
            </ion-segment-button>
          </ion-segment>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Calendar Tab -->
      <div v-if="activeTab === 'calendar'" class="calendar-tab">
        <template v-if="calendarView === 'month'">
          <MonthView v-model="selectedDate" />
          <div class="calendar-tab__day-events">
            <h4 class="calendar-tab__day-title">{{ selectedDateLabel }}</h4>
            <DayEventList :date="selectedDateStr" @add="showAddEvent = true" />
            <DayPlanList :date="selectedDateStr" />
          </div>
        </template>
        <template v-else>
          <WeekView v-model="selectedDate" />
        </template>
      </div>

      <!-- Countdown Tab -->
      <div v-if="activeTab === 'countdown'" class="countdown-tab">
        <template v-if="countdowns && countdowns.length > 0">
          <div class="countdown-tab__hero">
            <HeroCountdownCard
              :countdown="countdowns[0]"
              @click="goToCountdown(countdowns[0].id)"
            />
          </div>
          <div v-if="countdowns.length > 1" class="countdown-tab__list">
            <CountdownListTile
              v-for="cd in countdowns.slice(1)"
              :key="cd.id"
              :countdown="cd"
              @click="goToCountdown(cd.id)"
            />
          </div>
        </template>
        <EmptyState
          v-else
          :icon="mdiTimer"
          title="No countdowns"
          description="Add your first countdown event"
        />
      </div>

      <!-- Plans Tab -->
      <div v-if="activeTab === 'plans'" class="plans-tab">
        <template v-if="plans && plans.length > 0">
          <div
            v-for="plan in plans"
            :key="plan.id"
            class="plans-tab__card"
            :class="{ 'plans-tab__card--inactive': !plan.is_active }"
            @click="navigateToPlanForm(plan.id)"
            @contextmenu.prevent="openPlanActions(plan)"
          >
            <div class="plans-tab__card-header">
              <span
                v-if="plan.color"
                class="plans-tab__color"
                :style="{ backgroundColor: plan.color }"
              />
              <span class="plans-tab__name">{{ plan.name }}</span>
            </div>
            <span class="plans-tab__schedule">{{ getScheduleLabel(plan.schedule) }}</span>
            <span class="plans-tab__task-count">
              {{ plan.tasks.length }} task{{ plan.tasks.length !== 1 ? 's' : '' }}
            </span>
          </div>
        </template>
        <EmptyState
          v-else
          :icon="mdiCalendarMonth"
          title="No plans"
          description="Create a recurring plan"
        />
      </div>

      <!-- Add Event sheet -->
      <AddEventSheet
        :is-open="showAddEvent"
        :date="selectedDateStr"
        @close="showAddEvent = false"
      />

      <!-- Countdown form sheet -->
      <CountdownFormSheet
        :is-open="showCountdownForm"
        :countdown="editingCountdown"
        @close="closeCountdownForm"
      />

      <!-- Plan action sheet -->
      <ion-action-sheet
        :is-open="showPlanActions"
        :header="actionPlan?.name"
        :buttons="planActionButtons"
        @did-dismiss="showPlanActions = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonButton,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonActionSheet,
} from '@ionic/vue';
import {
  mdiAdd,
  mdiCalendarMonth,
  mdiTimer,
  mdiCalendarViewMonth,
  mdiViewWeek,
  mdiChecklist,
} from '@/shared/icons/material';
import { useIonRouter } from '@ionic/vue';
import type { Plan, Countdown } from '@/features/calendar/types/calendar.types';
import { toDateString, formatDate } from '@/shared/utils/date';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import { scheduleLabel as getScheduleLabel } from '@/features/calendar/utils/scheduleLabel';
import { useCountdownsQuery } from '@/features/calendar/composables/useCountdownsQuery';
import { usePlansQuery } from '@/features/calendar/composables/usePlansQuery';
import { useDeletePlanMutation } from '@/features/calendar/composables/useDeletePlanMutation';
import MonthView from '@/features/calendar/components/MonthView.vue';
import WeekView from '@/features/calendar/components/WeekView.vue';
import DayEventList from '@/features/calendar/components/DayEventList.vue';
import DayPlanList from '@/features/calendar/components/DayPlanList.vue';
import HeroCountdownCard from '@/features/calendar/components/HeroCountdownCard.vue';
import CountdownListTile from '@/features/calendar/components/CountdownListTile.vue';
import CountdownFormSheet from '@/features/calendar/components/CountdownFormSheet.vue';
import AddEventSheet from '@/features/calendar/components/AddEventSheet.vue';
import EmptyState from '@/shared/components/EmptyState.vue';

const ionRouter = useIonRouter();

const activeTab = ref('calendar');
const calendarView = ref<'month' | 'week'>('month');
const selectedDate = ref(new Date());
const showCountdownForm = ref(false);
const editingCountdown = ref<Countdown | undefined>(undefined);
const showPlanActions = ref(false);
const actionPlan = ref<Plan | null>(null);
const showAddEvent = ref(false);

const { data: countdowns } = useCountdownsQuery();
const { data: plans } = usePlansQuery();
const deletePlanMutation = useDeletePlanMutation();
const selectedDateStr = computed(() => toDateString(selectedDate.value));
const selectedDateLabel = computed(() => formatDate(selectedDateStr.value));

const viewIcon = computed(() => (calendarView.value === 'month' ? mdiViewWeek : mdiCalendarViewMonth));

function toggleView() {
  calendarView.value = calendarView.value === 'month' ? 'week' : 'month';
}

function goToCountdown(id: number) {
  ionRouter.push({ name: ROUTE_NAMES.COUNTDOWN_DETAIL, params: { id } });
}

function navigateToPlanForm(id?: number) {
  if (id) {
    ionRouter.push({ name: ROUTE_NAMES.PLAN_FORM, params: { id } });
  } else {
    ionRouter.push({ name: ROUTE_NAMES.PLAN_FORM });
  }
}

function closeCountdownForm() {
  showCountdownForm.value = false;
  editingCountdown.value = undefined;
}

function openPlanActions(plan: Plan) {
  actionPlan.value = plan;
  showPlanActions.value = true;
}

const planActionButtons = computed(() => [
  {
    text: 'Edit',
    handler: () => {
      if (actionPlan.value) {
        navigateToPlanForm(actionPlan.value.id);
      }
    },
  },
  {
    text: 'Delete',
    role: 'destructive' as const,
    handler: () => {
      if (actionPlan.value) {
        deletePlanMutation.mutate(actionPlan.value.id);
      }
    },
  },
  {
    text: 'Cancel',
    role: 'cancel' as const,
  },
]);
</script>

<style scoped>
/* Header */
.calendar-title {
  font-size: 20px;
  font-weight: 700;
  padding-inline: 16px;
}

.header-segment {
  padding-right: 8px;
}

.header-segment ion-segment {
  min-height: 32px;
}

.header-segment ion-segment-button {
  --padding-start: 8px;
  --padding-end: 8px;
  min-width: 40px;
  min-height: 32px;
}

.header-segment ion-segment-button ion-icon {
  font-size: 18px;
}

/* Calendar tab */
.calendar-tab {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.calendar-tab__day-events {
  padding: 8px 16px;
}

.calendar-tab__day-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-on-surface);
  margin: 8px 0 8px;
}

/* Countdown tab */
.countdown-tab {
  padding: 16px;
}

.countdown-tab__hero {
  margin-bottom: 16px;
}

.countdown-tab__list {
  display: flex;
  flex-direction: column;
}

/* Plans tab */
.plans-tab {
  padding: 16px;
}

.plans-tab__card {
  padding: 16px;
  background: var(--color-surface-container);
  border-radius: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.plans-tab__card:active {
  background: var(--color-surface-container-high);
}

.plans-tab__card--inactive {
  opacity: 0.5;
}

.plans-tab__card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.plans-tab__color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.plans-tab__name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-on-surface);
}

.plans-tab__schedule {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--ion-color-primary);
  padding-left: 18px;
}

.plans-tab__task-count {
  display: block;
  font-size: 12px;
  color: var(--color-on-surface-variant);
  opacity: 0.6;
  padding-left: 18px;
  margin-top: 2px;
}
</style>
