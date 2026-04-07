<template>
  <ion-page>
    <AppHeader title="Manage Folders">
      <template #start>
        <ion-back-button default-href="/tasks" />
      </template>
      <template #end>
        <ion-button @click="promptAddFolder">
          <ion-icon slot="icon-only" :icon="mdiAdd" />
        </ion-button>
      </template>
    </AppHeader>

    <ion-content class="ion-padding">
      <ion-accordion-group v-if="folders?.length" multiple>
        <ion-accordion v-for="folder in folders" :key="folder.id" :value="String(folder.id)">
          <ion-item-sliding slot="header">
            <ion-item>
              <ion-icon slot="start" :icon="mdiFolder" />
              <ion-label>{{ folder.name }}</ion-label>
              <ion-note slot="end">{{ folder.categories.length }}</ion-note>
            </ion-item>
            <ion-item-options>
              <ion-item-option color="primary" @click="promptEditFolder(folder)">
                Edit
              </ion-item-option>
              <ion-item-option color="danger" @click="handleDeleteFolder(folder.id)">
                Delete
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>

          <div slot="content" class="folder-content">
            <!-- Categories -->
            <ion-item-sliding v-for="cat in folder.categories" :key="cat.id ?? cat.name">
              <ion-item>
                <span
                  slot="start"
                  class="category-dot"
                  :style="{ backgroundColor: cat.color }"
                />
                <ion-label>{{ cat.name }}</ion-label>
                <ion-note slot="end">{{ cat.tasks_count }}</ion-note>
              </ion-item>
              <ion-item-options>
                <ion-item-option color="primary" @click="promptEditCategory(folder, cat)">
                  Edit
                </ion-item-option>
                <ion-item-option v-if="cat.id" color="danger" @click="handleDeleteCategory(cat.id!)">
                  Delete
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>

            <!-- Add category inline -->
            <ion-item v-if="addingCategoryFolderId === folder.id">
              <span
                slot="start"
                class="category-dot"
                :style="{ backgroundColor: newCategoryColor || '#9e9e9e' }"
                @click="showCatColorPicker = !showCatColorPicker"
              />
              <ion-input
                v-model="newCategoryName"
                placeholder="Category name"
                @keydown.enter="submitNewCategory(folder.id)"
              />
              <ion-button
                slot="end"
                fill="clear"
                size="small"
                :disabled="!newCategoryName.trim() || isCreatingCategory"
                @click="submitNewCategory(folder.id)"
              >
                <ion-icon :icon="mdiCheck" />
              </ion-button>
            </ion-item>
            <div v-if="addingCategoryFolderId === folder.id && showCatColorPicker" class="inline-color-picker">
              <ColorPickerRow v-model="newCategoryColor" />
            </div>

            <ion-button
              v-if="addingCategoryFolderId !== folder.id"
              fill="clear"
              size="small"
              expand="block"
              @click="startAddCategory(folder.id)"
            >
              <ion-icon slot="start" :icon="mdiAdd" />
              Add Category
            </ion-button>
          </div>
        </ion-accordion>
      </ion-accordion-group>

      <EmptyState
        v-if="!isLoading && !folders?.length"
        :icon="mdiFolder"
        title="No folders yet"
        description="Tap + to create your first folder"
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
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonNote,
  IonInput,
  alertController,
} from '@ionic/vue';
import AppHeader from '@/shared/components/AppHeader.vue';
import { mdiAdd, mdiFolder, mdiCheck } from '@/shared/icons/material';

import ColorPickerRow from '@/shared/components/ColorPickerRow.vue';
import EmptyState from '@/shared/components/EmptyState.vue';

import { useTaskFoldersQuery } from '@/features/tasks/composables/useTaskFoldersQuery';
import { useCreateTaskFolderMutation } from '@/features/tasks/composables/useCreateTaskFolderMutation';
import { useUpdateTaskFolderMutation } from '@/features/tasks/composables/useUpdateTaskFolderMutation';
import { useDeleteTaskFolderMutation } from '@/features/tasks/composables/useDeleteTaskFolderMutation';
import { useCreateTaskCategoryMutation } from '@/features/tasks/composables/useCreateTaskCategoryMutation';
import { useUpdateTaskCategoryMutation } from '@/features/tasks/composables/useUpdateTaskCategoryMutation';
import { useDeleteTaskCategoryMutation } from '@/features/tasks/composables/useDeleteTaskCategoryMutation';
import type { TaskFolder, TaskCategory } from '@/features/tasks/types/tasks.types';
import type { ID } from '@/shared/types/common';

const { data: folders, isLoading } = useTaskFoldersQuery();

const createFolderMutation = useCreateTaskFolderMutation();
const updateFolderMutation = useUpdateTaskFolderMutation();
const deleteFolderMutation = useDeleteTaskFolderMutation();
const createCategoryMutation = useCreateTaskCategoryMutation();
const updateCategoryMutation = useUpdateTaskCategoryMutation();
const deleteCategoryMutation = useDeleteTaskCategoryMutation();

// Category add state
const addingCategoryFolderId = ref<ID | null>(null);
const newCategoryName = ref('');
const newCategoryColor = ref<string | null>(null);
const showCatColorPicker = ref(false);
const isCreatingCategory = ref(false);

function startAddCategory(folderId: ID) {
  addingCategoryFolderId.value = folderId;
  newCategoryName.value = '';
  newCategoryColor.value = null;
  showCatColorPicker.value = false;
}

function submitNewCategory(folderId: ID) {
  const name = newCategoryName.value.trim();
  if (!name || isCreatingCategory.value) return;

  isCreatingCategory.value = true;
  createCategoryMutation.mutate(
    { name, task_folder_id: folderId, color: newCategoryColor.value ?? undefined },
    {
      onSuccess: () => {
        addingCategoryFolderId.value = null;
        newCategoryName.value = '';
        isCreatingCategory.value = false;
      },
      onError: () => {
        isCreatingCategory.value = false;
      },
    },
  );
}

async function promptAddFolder() {
  const alert = await alertController.create({
    header: 'New Folder',
    inputs: [{ name: 'name', type: 'text', placeholder: 'Folder name' }],
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Create',
        handler: (data) => {
          const name = data.name?.trim();
          if (name) createFolderMutation.mutate({ name });
        },
      },
    ],
  });
  await alert.present();
}

async function promptEditFolder(folder: TaskFolder) {
  const alert = await alertController.create({
    header: 'Rename Folder',
    inputs: [{ name: 'name', type: 'text', value: folder.name }],
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Save',
        handler: (data) => {
          const name = data.name?.trim();
          if (name) updateFolderMutation.mutate({ id: folder.id, payload: { name } });
        },
      },
    ],
  });
  await alert.present();
}

function handleDeleteFolder(id: ID) {
  deleteFolderMutation.mutate(id);
}

async function promptEditCategory(folder: TaskFolder, cat: TaskCategory) {
  const alert = await alertController.create({
    header: 'Rename Category',
    inputs: [{ name: 'name', type: 'text', value: cat.name }],
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Save',
        handler: (data) => {
          const name = data.name?.trim();
          if (name && cat.id) {
            updateCategoryMutation.mutate({
              id: cat.id,
              payload: { name, task_folder_id: folder.id },
            });
          }
        },
      },
    ],
  });
  await alert.present();
}

function handleDeleteCategory(id: ID) {
  deleteCategoryMutation.mutate(id);
}
</script>

<style scoped>
.folder-content {
  padding-left: 16px;
}

.category-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  cursor: pointer;
}

.inline-color-picker {
  padding: 0 16px;
}
</style>
