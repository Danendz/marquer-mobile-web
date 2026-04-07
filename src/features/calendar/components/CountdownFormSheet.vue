<template>
  <ion-modal :is-open="isOpen" @did-dismiss="$emit('close')">
    <AppHeader :title="isEditing ? 'Edit Countdown' : 'New Countdown'">
      <template #start>
        <ion-button @click="$emit('close')">Cancel</ion-button>
      </template>
      <template #end>
        <ion-button :strong="true" :disabled="!canSave" @click="save">
          Save
        </ion-button>
      </template>
    </AppHeader>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-input
            v-model="name"
            label="Name"
            label-placement="stacked"
            placeholder="Countdown name"
          />
        </ion-item>

        <ion-item>
          <ion-label>Target Date</ion-label>
          <ion-datetime-button datetime="countdown-date" />
        </ion-item>
      </ion-list>

      <ion-modal :keep-contents-mounted="true">
        <ion-datetime
          id="countdown-date"
          v-model="targetDate"
          presentation="date"
        />
      </ion-modal>

      <!-- Background image picker -->
      <div class="bg-picker">
        <p class="bg-picker__title">Background Image</p>
        <div class="bg-picker__grid">
          <button
            v-for="bg in TIMER_BACKGROUNDS"
            :key="bg"
            type="button"
            class="bg-picker__item"
            :class="{ 'bg-picker__item--selected': selectedBg === bg }"
            @click="selectedBg = bg"
          >
            <img :src="timerBgUrl(bg)" alt="" class="bg-picker__img" />
          </button>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  IonModal,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonLabel,
  IonDatetimeButton,
  IonDatetime,
} from '@ionic/vue';
import AppHeader from '@/shared/components/AppHeader.vue';
import type { Countdown } from '@/features/calendar/types/calendar.types';
import { TIMER_BACKGROUNDS, randomTimerBackground, timerBgUrl } from '@/shared/constants/timerBackgrounds';
import { useCreateCountdownMutation } from '@/features/calendar/composables/useCreateCountdownMutation';
import { useUpdateCountdownMutation } from '@/features/calendar/composables/useUpdateCountdownMutation';
import { toDateString } from '@/shared/utils/date';

const props = defineProps<{
  isOpen: boolean;
  countdown?: Countdown;
}>();

const emit = defineEmits<{
  close: [];
}>();

const isEditing = computed(() => !!props.countdown);

const name = ref('');
const targetDate = ref(toDateString(new Date()));
const selectedBg = ref(randomTimerBackground());

const canSave = computed(() => name.value.trim().length > 0);

const createMutation = useCreateCountdownMutation();
const updateMutation = useUpdateCountdownMutation();

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      if (props.countdown) {
        name.value = props.countdown.name;
        targetDate.value = props.countdown.target_date;
        selectedBg.value = props.countdown.bg_image;
      } else {
        name.value = '';
        targetDate.value = toDateString(new Date());
        selectedBg.value = randomTimerBackground();
      }
    }
  },
);

function save() {
  if (!canSave.value) return;

  // ion-datetime may return ISO with time; extract date part
  const dateOnly = targetDate.value.substring(0, 10);

  if (isEditing.value && props.countdown) {
    updateMutation.mutate(
      {
        id: props.countdown.id,
        payload: {
          name: name.value.trim(),
          target_date: dateOnly,
          bg_image: selectedBg.value,
        },
      },
      { onSuccess: () => emit('close') },
    );
  } else {
    createMutation.mutate(
      {
        name: name.value.trim(),
        target_date: dateOnly,
        bg_image: selectedBg.value,
      },
      { onSuccess: () => emit('close') },
    );
  }
}
</script>

<style scoped>
.bg-picker {
  margin-top: 16px;
}

.bg-picker__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-on-surface);
  margin-bottom: 8px;
}

.bg-picker__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.bg-picker__item {
  aspect-ratio: 1;
  border-radius: 10px;
  overflow: hidden;
  border: 3px solid transparent;
  padding: 0;
  background: none;
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.bg-picker__item--selected {
  border-color: var(--ion-color-primary);
}

.bg-picker__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
