<template>
  <ion-modal
    :is-open="isOpen"
    :initial-breakpoint="0.5"
    :breakpoints="[0, 0.5, 0.85]"
    @did-dismiss="$emit('dismiss')"
  >
    <div class="category-picker">
      <div class="category-picker__handle" />
      <h3 class="category-picker__title">Select Category</h3>

      <ion-list v-if="allCategories.length">
        <ion-item
          v-for="cat in allCategories"
          :key="cat.id"
          button
          @click="select(cat.id!)"
        >
          <span
            slot="start"
            class="category-picker__dot"
            :style="{ backgroundColor: cat.color }"
          />
          <ion-label>
            <h3>{{ cat.name }}</h3>
            <p>{{ cat.folderName }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <div v-else class="category-picker__empty">
        <p>No categories yet. Create folders and categories first.</p>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonModal, IonList, IonItem, IonLabel } from '@ionic/vue';
import { useTaskFoldersQuery } from '@/features/tasks/composables/useTaskFoldersQuery';
import type { ID } from '@/shared/types/common';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  dismiss: [];
  select: [id: ID];
}>();

const { data: folders } = useTaskFoldersQuery();

const allCategories = computed(() => {
  if (!folders.value) return [];
  return folders.value.flatMap((folder) =>
    folder.categories
      .filter((cat) => cat.id != null)
      .map((cat) => ({
        ...cat,
        folderName: folder.name,
      })),
  );
});

function select(id: ID) {
  emit('select', id);
  emit('dismiss');
}
</script>

<style scoped>
.category-picker {
  padding: 16px 0;
}

.category-picker__handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--color-outline);
  margin: 0 auto 12px;
}

.category-picker__title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 16px 8px;
}

.category-picker__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.category-picker__empty {
  padding: 32px 16px;
  text-align: center;
  color: var(--color-on-surface-variant);
}
</style>
