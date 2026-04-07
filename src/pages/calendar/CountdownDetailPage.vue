<template>
  <ion-page>
    <ion-header class="ion-no-border" translucent>
      <ion-toolbar class="detail-toolbar">
        <ion-buttons slot="start">
          <ion-back-button default-href="/calendar" color="light" />
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button color="light" @click="showEditForm = true">
            <ion-icon slot="icon-only" :icon="mdiEdit" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div v-if="countdown" class="detail">
        <img
          :src="timerBgUrl(countdown.bg_image)"
          alt=""
          class="detail__bg"
        />
        <div class="detail__gradient" />
        <div class="detail__content">
          <span class="detail__days">{{ Math.abs(days) }}</span>
          <span class="detail__label">{{ label }}</span>
          <span class="detail__name">{{ countdown.name }}</span>
          <span class="detail__date">{{ formattedDate }}</span>
        </div>
      </div>

      <div v-else class="detail__loading">
        <ion-spinner name="dots" />
      </div>

      <CountdownFormSheet
        :is-open="showEditForm"
        :countdown="countdown"
        @close="showEditForm = false"
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
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/vue';
import { mdiEdit } from '@/shared/icons/material';
import { useRoute } from 'vue-router';
import { useCountdownsQuery } from '@/features/calendar/composables/useCountdownsQuery';
import { daysUntil, daysLabel, formatDate } from '@/shared/utils/date';
import CountdownFormSheet from '@/features/calendar/components/CountdownFormSheet.vue';
import { timerBgUrl } from '@/shared/constants/timerBackgrounds';

const route = useRoute();
const showEditForm = ref(false);

const countdownId = computed(() => Number(route.params.id));

const { data: countdowns } = useCountdownsQuery();

const countdown = computed(() => {
  if (!countdowns.value) return undefined;
  return countdowns.value.find((c) => c.id === countdownId.value);
});

const days = computed(() => (countdown.value ? daysUntil(countdown.value.target_date) : 0));
const label = computed(() => daysLabel(days.value));
const formattedDate = computed(() =>
  countdown.value ? formatDate(countdown.value.target_date) : '',
);
</script>

<style scoped>
.detail-toolbar {
  --background: transparent;
  --border-width: 0;
}

.detail {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
}

.detail__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.2) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

.detail__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 100vh;
  color: #fff;
  text-align: center;
  padding: 24px;
}

.detail__days {
  font-size: 72px;
  font-weight: 800;
  line-height: 1;
}

.detail__label {
  font-size: 16px;
  font-weight: 500;
  opacity: 0.85;
  margin-top: 4px;
}

.detail__name {
  font-size: 24px;
  font-weight: 700;
  margin-top: 24px;
  max-width: 80%;
}

.detail__date {
  font-size: 14px;
  opacity: 0.7;
  margin-top: 8px;
}

.detail__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 50vh;
}
</style>
