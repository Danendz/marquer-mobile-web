<template>
  <div
    class="note-tile"
    @click="$emit('tap')"
    @contextmenu.prevent="showMenu = true"
  >
    <div class="note-tile__icon">
      <ion-icon :icon="mdiDescription" />
    </div>
    <p class="note-tile__title">{{ note.title || 'Untitled' }}</p>

    <ion-action-sheet
      :is-open="showMenu"
      :buttons="menuButtons"
      @did-dismiss="showMenu = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonIcon, IonActionSheet } from '@ionic/vue';
import { mdiDescription } from '@/shared/icons/material';
import type { ListNote } from '@/features/notes/types/notes.types';

defineProps<{
  note: ListNote;
}>();

const emit = defineEmits<{
  tap: [];
  delete: [];
}>();

const showMenu = ref(false);

const menuButtons = [
  {
    text: 'Delete',
    role: 'destructive',
    handler: () => emit('delete'),
  },
  {
    text: 'Cancel',
    role: 'cancel',
  },
];
</script>

<style scoped>
.note-tile {
  background: var(--color-surface-container);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 120px;
}

.note-tile:active {
  background: var(--color-surface-container-highest);
}

.note-tile__icon {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: var(--color-on-surface-variant);
  opacity: 0.5;
}

.note-tile__title {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-on-surface);
  text-align: center;
  margin: 8px 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  width: 100%;
}
</style>
