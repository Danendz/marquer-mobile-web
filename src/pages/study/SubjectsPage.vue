<template>
  <ion-page>
    <AppHeader title="Subjects">
      <template #start>
        <ion-back-button default-href="/" />
      </template>
      <template #end>
        <ion-button @click="openAddSheet">
          <ion-icon slot="icon-only" :icon="mdiAdd" />
        </ion-button>
      </template>
    </AppHeader>

    <ion-content class="ion-padding">
      <!-- Subjects grid -->
      <div v-if="subjects?.length" class="subjects-grid">
        <button
          v-for="subject in subjects"
          :key="subject.id"
          class="subject-card"
          :style="{ backgroundColor: subject.color + '33' }"
          @click.prevent
          @contextmenu.prevent="openActions(subject)"
          @long-press="openActions(subject)"
        >
          <span
            class="subject-card__dot"
            :style="{ backgroundColor: subject.color }"
          />
          <span class="subject-card__name">{{ subject.name }}</span>
        </button>
      </div>

      <EmptyState
        v-if="!isLoading && !subjects?.length"
        :icon="mdiCategory"
        title="No subjects yet"
        description="Tap + to create your first subject"
      />

      <!-- Subject Form Sheet -->
      <SubjectFormSheet
        :is-open="showFormSheet"
        :subject="editingSubject"
        @dismiss="closeFormSheet"
        @saved="closeFormSheet"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage,
  IonContent,
  IonBackButton,
  IonButton,
  IonIcon,
  actionSheetController,
} from '@ionic/vue';
import AppHeader from '@/shared/components/AppHeader.vue';
import { mdiAdd, mdiCategory, mdiEdit, mdiDelete } from '@/shared/icons/material';
import SubjectFormSheet from '@/features/study/components/SubjectFormSheet.vue';
import EmptyState from '@/shared/components/EmptyState.vue';
import { useStudySubjectsQuery } from '@/features/study/composables/useStudySubjectsQuery';
import { useDeleteStudySubjectMutation } from '@/features/study/composables/useDeleteStudySubjectMutation';
import type { StudySubject } from '@/features/study/types/study.types';

const { data: subjects, isLoading } = useStudySubjectsQuery();
const deleteMutation = useDeleteStudySubjectMutation();

const showFormSheet = ref(false);
const editingSubject = ref<StudySubject | undefined>(undefined);

function openAddSheet() {
  editingSubject.value = undefined;
  showFormSheet.value = true;
}

function closeFormSheet() {
  showFormSheet.value = false;
  editingSubject.value = undefined;
}

async function openActions(subject: StudySubject) {
  if (subject.is_system) return;

  const sheet = await actionSheetController.create({
    header: subject.name,
    buttons: [
      {
        text: 'Edit',
        icon: mdiEdit,
        handler: () => {
          editingSubject.value = subject;
          showFormSheet.value = true;
        },
      },
      {
        text: 'Delete',
        icon: mdiDelete,
        role: 'destructive',
        handler: () => {
          deleteMutation.mutate(subject.id);
        },
      },
      {
        text: 'Cancel',
        role: 'cancel',
      },
    ],
  });
  await sheet.present();
}
</script>

<style scoped>
.subjects-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.subject-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 16px;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.subject-card:active {
  transform: scale(0.97);
}

.subject-card__dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.subject-card__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-on-surface);
  text-align: center;
  word-break: break-word;
}
</style>
