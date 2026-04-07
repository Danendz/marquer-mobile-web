<template>
  <ion-modal :is-open="isOpen" :initial-breakpoint="0.45" :breakpoints="[0, 0.45]" @did-dismiss="$emit('dismiss')">
    <AppHeader :title="subject ? 'Edit Subject' : 'New Subject'">
      <template #end>
        <ion-button @click="$emit('dismiss')">Cancel</ion-button>
      </template>
    </AppHeader>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-input
          v-model="name"
          label="Subject Name"
          label-placement="stacked"
          placeholder="e.g. Mathematics"
          :counter="true"
          :maxlength="100"
        />
      </ion-item>

      <div class="ion-margin-top">
        <p class="text-sm text-gray-500 mb-1">Color</p>
        <ColorPickerRow v-model="color" />
      </div>

      <ion-button
        class="ion-margin-top"
        expand="block"
        :disabled="!name.trim() || isSaving"
        @click="handleSave"
      >
        {{ subject ? 'Update' : 'Create' }}
      </ion-button>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  IonModal,
  IonContent,
  IonButton,
  IonItem,
  IonInput,
} from '@ionic/vue';
import AppHeader from '@/shared/components/AppHeader.vue';
import ColorPickerRow from '@/shared/components/ColorPickerRow.vue';
import { useCreateStudySubjectMutation } from '@/features/study/composables/useCreateStudySubjectMutation';
import { useUpdateStudySubjectMutation } from '@/features/study/composables/useUpdateStudySubjectMutation';
import type { StudySubject } from '@/features/study/types/study.types';

const props = defineProps<{
  isOpen: boolean;
  subject?: StudySubject;
}>();

const emit = defineEmits<{
  dismiss: [];
  saved: [];
}>();

const name = ref('');
const color = ref<string | null>(null);
const isSaving = ref(false);

const createMutation = useCreateStudySubjectMutation();
const updateMutation = useUpdateStudySubjectMutation();

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      name.value = props.subject?.name ?? '';
      color.value = props.subject?.color ?? null;
      isSaving.value = false;
    }
  },
);

function handleSave() {
  const trimmed = name.value.trim();
  if (!trimmed || isSaving.value) return;

  isSaving.value = true;
  const payload = { name: trimmed, color: color.value ?? '#4A7AE8' };

  const onSuccess = () => {
    isSaving.value = false;
    emit('saved');
    emit('dismiss');
  };

  const onError = () => {
    isSaving.value = false;
  };

  if (props.subject) {
    updateMutation.mutate({ id: props.subject.id, payload }, { onSuccess, onError });
  } else {
    createMutation.mutate(payload, { onSuccess, onError });
  }
}
</script>
