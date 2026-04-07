<template>
  <ion-page>
    <AppHeader title="Tasks">
      <template #start>
        <ion-back-button default-href="/" />
      </template>
      <template #end>
        <ion-button @click="showFilter = true">
          <ion-icon slot="icon-only" :icon="mdiFilterList" />
        </ion-button>
      </template>
    </AppHeader>

    <ion-content class="ion-padding">
      <TaskAddInput :category-id="activeCategoryId" @created="refetchTasks" />

      <!-- Active tasks -->
      <div v-if="activeTasks.length">
        <TaskItemCard
          v-for="task in activeTasks"
          :key="task.id"
          :task="task"
          :category="getCategoryForTask(task)"
          @toggle="toggleStatus(task)"
          @edit="editTask(task)"
        />
      </div>

      <!-- Completed section (collapsible) -->
      <ion-accordion-group v-if="completedTasks.length" class="ion-margin-top">
        <ion-accordion value="completed">
          <ion-item slot="header">
            <ion-label>Completed ({{ completedTasks.length }})</ion-label>
          </ion-item>
          <div slot="content">
            <TaskItemCard
              v-for="task in completedTasks"
              :key="task.id"
              :task="task"
              :category="getCategoryForTask(task)"
              @toggle="toggleStatus(task)"
              @edit="editTask(task)"
            />
          </div>
        </ion-accordion>
      </ion-accordion-group>

      <!-- Deleted view -->
      <div v-if="isDeletedView">
        <TaskItemCard
          v-for="task in cancelledTasks"
          :key="task.id"
          :task="task"
          :category="getCategoryForTask(task)"
          :is-deleted-view="true"
        />
      </div>

      <!-- Empty state -->
      <EmptyState
        v-if="!isLoading && !activeTasks.length && !completedTasks.length && !isDeletedView"
        :icon="mdiChecklist"
        title="No tasks yet"
        description="Tap above to add your first task"
      />

      <EmptyState
        v-if="isDeletedView && !cancelledTasks.length"
        :icon="mdiDelete"
        title="No deleted tasks"
      />

      <!-- Task Edit Sheet -->
      <TaskEditSheet
        :is-open="showEditSheet"
        :task="editingTask!"
        @dismiss="showEditSheet = false"
        @save="saveTask"
      />

      <!-- Filter Dropdown -->
      <TaskFilterDropdown
        :is-open="showFilter"
        :current-filter="currentFilter"
        @dismiss="showFilter = false"
        @update:current-filter="currentFilter = $event"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonPage,
  IonContent,
  IonBackButton,
  IonButton,
  IonIcon,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
} from '@ionic/vue';
import AppHeader from '@/shared/components/AppHeader.vue';
import { mdiFilterList, mdiChecklist, mdiDelete } from '@/shared/icons/material';

import TaskItemCard from '@/features/tasks/components/TaskItemCard.vue';
import TaskAddInput from '@/features/tasks/components/TaskAddInput.vue';
import TaskEditSheet from '@/features/tasks/components/TaskEditSheet.vue';
import TaskFilterDropdown from '@/features/tasks/components/TaskFilterDropdown.vue';
import type { TaskFilter } from '@/features/tasks/components/TaskFilterDropdown.vue';
import EmptyState from '@/shared/components/EmptyState.vue';

import { useTasksQuery } from '@/features/tasks/composables/useTasksQuery';
import { useTaskFoldersQuery } from '@/features/tasks/composables/useTaskFoldersQuery';
import { useUpdateTaskMutation } from '@/features/tasks/composables/useUpdateTaskMutation';
import type { Task, TaskCategory, GetTasksParams } from '@/features/tasks/types/tasks.types';
import { TaskStatus } from '@/features/tasks/types/tasks.types';

const currentFilter = ref<TaskFilter>('all');
const showFilter = ref(false);
const showEditSheet = ref(false);
const editingTask = ref<Task | null>(null);

const queryParams = computed<GetTasksParams | undefined>(() => {
  if (currentFilter.value === 'deleted') return { status: TaskStatus.Cancelled };
  if (typeof currentFilter.value === 'object') {
    return { task_category_id: currentFilter.value.categoryId };
  }
  return undefined;
});

const { data: tasks, isLoading, refetch: refetchTasks } = useTasksQuery(queryParams);
const { data: folders } = useTaskFoldersQuery();
const updateMutation = useUpdateTaskMutation();

const isDeletedView = computed(() => currentFilter.value === 'deleted');

const activeCategoryId = computed(() =>
  typeof currentFilter.value === 'object' ? currentFilter.value.categoryId : undefined,
);

const activeTasks = computed(() =>
  (tasks.value ?? []).filter(
    (t) => t.status !== TaskStatus.Done && t.status !== TaskStatus.Cancelled,
  ),
);

const completedTasks = computed(() =>
  (tasks.value ?? []).filter((t) => t.status === TaskStatus.Done),
);

const cancelledTasks = computed(() =>
  (tasks.value ?? []).filter((t) => t.status === TaskStatus.Cancelled),
);

function getCategoryForTask(task: Task): TaskCategory | undefined {
  if (!task.task_category_id || !folders.value) return undefined;
  for (const folder of folders.value) {
    const cat = folder.categories.find((c) => c.id === task.task_category_id);
    if (cat) return cat;
  }
  return undefined;
}

function toggleStatus(task: Task) {
  const newStatus = task.status === TaskStatus.Done ? TaskStatus.Draft : TaskStatus.Done;
  updateMutation.mutate({ id: task.id, payload: { status: newStatus } });
}

function editTask(task: Task) {
  editingTask.value = task;
  showEditSheet.value = true;
}

function saveTask(payload: Record<string, unknown>) {
  if (!editingTask.value) return;
  updateMutation.mutate(
    { id: editingTask.value.id, payload },
    { onSuccess: () => { showEditSheet.value = false; } },
  );
}
</script>
