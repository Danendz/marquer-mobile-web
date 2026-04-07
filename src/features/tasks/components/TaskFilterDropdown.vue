<template>
  <ion-modal
    :is-open="isOpen"
    :initial-breakpoint="0.5"
    :breakpoints="[0, 0.5, 0.85]"
    @did-dismiss="$emit('dismiss')"
  >
    <div class="filter-sheet">
      <div class="filter-sheet__handle" />
      <h3 class="filter-sheet__title">Filter Tasks</h3>

      <ion-list>
        <ion-item
          button
          :class="{ 'filter-sheet__active': currentFilter === 'all' }"
          @click="selectFilter('all')"
        >
          <ion-icon slot="start" :icon="mdiFormatListBulleted" />
          <ion-label>All Tasks</ion-label>
          <ion-icon v-if="currentFilter === 'all'" slot="end" :icon="mdiCheck" color="primary" />
        </ion-item>

        <ion-item
          button
          :class="{ 'filter-sheet__active': currentFilter === 'deleted' }"
          @click="selectFilter('deleted')"
        >
          <ion-icon slot="start" :icon="mdiDelete" />
          <ion-label>Recently Deleted</ion-label>
          <ion-icon v-if="currentFilter === 'deleted'" slot="end" :icon="mdiCheck" color="primary" />
        </ion-item>
      </ion-list>

      <div class="filter-sheet__folders-header">
        <span class="filter-sheet__section-title">Folders</span>
        <ion-button fill="clear" size="small" @click="goToManage">
          Manage
        </ion-button>
      </div>

      <ion-accordion-group :value="expandedFolders" multiple>
        <ion-accordion v-for="folder in sortedFolders" :key="folder.id" :value="String(folder.id)">
          <ion-item slot="header">
            <ion-icon slot="start" :icon="mdiFolder" />
            <ion-label>{{ folder.name }}</ion-label>
          </ion-item>
          <div slot="content" class="filter-sheet__categories">
            <ion-item
              v-for="cat in folder.categories"
              :key="cat.id"
              button
              class="filter-sheet__category"
              @click="selectCategory(cat.id!)"
            >
              <span
                slot="start"
                class="filter-sheet__dot"
                :style="{ backgroundColor: cat.color }"
              />
              <ion-label>{{ cat.name }}</ion-label>
              <ion-icon
                v-if="typeof currentFilter === 'object' && currentFilter.categoryId === cat.id"
                slot="end"
                :icon="mdiCheck"
                color="primary"
              />
            </ion-item>
          </div>
        </ion-accordion>
      </ion-accordion-group>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonModal,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonAccordionGroup,
  IonAccordion,
} from '@ionic/vue';
import { mdiFormatListBulleted, mdiDelete, mdiFolder, mdiCheck } from '@/shared/icons/material';
import { useTaskFoldersQuery } from '@/features/tasks/composables/useTaskFoldersQuery';
import { ROUTE_PATHS } from '@/shared/constants/routes';
import type { ID } from '@/shared/types/common';

export type TaskFilter = 'all' | 'deleted' | { categoryId: ID };

const props = defineProps<{
  isOpen: boolean;
  currentFilter: TaskFilter;
}>();

const emit = defineEmits<{
  dismiss: [];
  'update:currentFilter': [filter: TaskFilter];
}>();

const router = useRouter();
const { data: folders } = useTaskFoldersQuery();

// Smart ordering: active category's parent folder moves to top
const sortedFolders = computed(() => {
  if (!folders.value) return [];
  const all = [...folders.value];

  if (typeof props.currentFilter === 'object') {
    const activeId = props.currentFilter.categoryId;
    const parentIdx = all.findIndex((f) =>
      f.categories.some((c) => c.id === activeId),
    );
    if (parentIdx > 0) {
      const [parent] = all.splice(parentIdx, 1);
      all.unshift(parent);
    }
  }

  return all;
});

// Auto-expand folder containing active category filter
const expandedFolders = computed(() => {
  if (typeof props.currentFilter !== 'object' || !folders.value) return [];
  const activeId = props.currentFilter.categoryId;
  const parent = folders.value.find((f) =>
    f.categories.some((c) => c.id === activeId),
  );
  return parent ? [String(parent.id)] : [];
});

function selectFilter(filter: 'all' | 'deleted') {
  emit('update:currentFilter', filter);
  emit('dismiss');
}

function selectCategory(id: ID) {
  emit('update:currentFilter', { categoryId: id });
  emit('dismiss');
}

function goToManage() {
  emit('dismiss');
  router.push(ROUTE_PATHS.MANAGE_FOLDERS);
}
</script>

<style scoped>
.filter-sheet {
  padding: 16px 0;
}

.filter-sheet__handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--color-outline);
  margin: 0 auto 12px;
}

.filter-sheet__title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 16px 8px;
}

.filter-sheet__active {
  --background: var(--color-primary-container);
}

.filter-sheet__folders-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 0;
}

.filter-sheet__section-title {
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-on-surface-variant);
}

.filter-sheet__categories {
  padding-left: 16px;
}

.filter-sheet__category {
  --min-height: 40px;
}

.filter-sheet__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
