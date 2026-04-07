<template>
  <div class="task-add-input">
    <div class="task-add-input__circle">
      <ion-icon :icon="mdiAdd" />
    </div>
    <ion-input
      v-model="inputValue"
      placeholder="Add a task..."
      :clear-input="false"
      class="task-add-input__field"
      @keydown.enter="handleSubmit"
      @ion-blur="handleBlur"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonInput, IonIcon } from '@ionic/vue';
import { mdiAdd } from '@/shared/icons/material';
import { useCreateTaskMutation } from '@/features/tasks/composables/useCreateTaskMutation';
import type { ID } from '@/shared/types/common';

const props = defineProps<{
  categoryId?: ID;
}>();

const emit = defineEmits<{
  created: [];
}>();

const inputValue = ref('');
const createMutation = useCreateTaskMutation();

function handleSubmit() {
  const name = inputValue.value.trim();
  if (!name) return;

  createMutation.mutate(
    {
      name,
      task_category_id: props.categoryId,
    },
    {
      onSuccess: () => {
        inputValue.value = '';
        emit('created');
      },
    },
  );
}

function handleBlur() {
  const name = inputValue.value.trim();
  if (name) handleSubmit();
}
</script>

<style scoped>
.task-add-input {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: var(--color-surface-container);
  border-radius: 16px;
  margin-bottom: 12px;
}

.task-add-input__circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  min-width: 24px;
  border-radius: 50%;
  border: 2px solid var(--color-outline);
  color: var(--color-on-surface-variant);
  font-size: 14px;
}

.task-add-input__field {
  --padding-start: 0;
  --padding-end: 0;
  font-size: 15px;
}
</style>
