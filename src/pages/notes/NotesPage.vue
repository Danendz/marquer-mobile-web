<template>
  <ion-page>
    <AppHeader title="Notes">
      <template #end>
        <ion-button @click="createNote">
          <ion-icon slot="icon-only" :icon="mdiAdd" />
        </ion-button>
      </template>
    </AppHeader>

    <ion-content>
      <ion-refresher slot="fixed" @ion-refresh="handleRefresh">
        <ion-refresher-content />
      </ion-refresher>

      <div v-if="notes?.length" class="notes-grid ion-padding">
        <NoteTile
          v-for="note in notes"
          :key="note.id"
          :note="note"
          @tap="openNote(note.id)"
          @delete="deleteNote(note.id)"
        />
      </div>

      <EmptyState
        v-if="!isLoading && !notes?.length"
        :icon="mdiDescription"
        title="No notes yet"
        description="Tap + to create your first note"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/vue';
import AppHeader from '@/shared/components/AppHeader.vue';
import { mdiAdd, mdiDescription } from '@/shared/icons/material';
import NoteTile from '@/features/notes/components/NoteTile.vue';
import EmptyState from '@/shared/components/EmptyState.vue';
import { useNotesQuery } from '@/features/notes/composables/useNotesQuery';
import { useDeleteNoteMutation } from '@/features/notes/composables/useDeleteNoteMutation';
import { ROUTE_NAMES } from '@/shared/constants/routes';
import type { ID } from '@/shared/types/common';

const router = useRouter();
const { data: notes, isLoading, refetch } = useNotesQuery();
const deleteMutation = useDeleteNoteMutation();

function createNote() {
  router.push({ name: ROUTE_NAMES.NOTE_EDITOR, params: { id: 'new' } });
}

function openNote(id: ID) {
  router.push({ name: ROUTE_NAMES.NOTE_EDITOR, params: { id } });
}

function deleteNote(id: ID) {
  deleteMutation.mutate(id);
}

async function handleRefresh(e: globalThis.CustomEvent) {
  await refetch();
  (e.target as unknown as { complete: () => void }).complete();
}
</script>

<style scoped>
.notes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (min-width: 600px) {
  .notes-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
