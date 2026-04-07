<template>
  <button
    type="button"
    class="circle-checkbox"
    :class="{ 'circle-checkbox--checked': checked, 'circle-checkbox--disabled': disabled }"
    :style="{ '--cb-color': color || 'var(--ion-color-primary)' }"
    :disabled="disabled"
    @click.stop="!disabled && $emit('toggle')"
  >
    <ion-icon v-if="checked" :icon="mdiCheck" class="circle-checkbox__icon" />
  </button>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
import { mdiCheck } from '@/shared/icons/material';

defineProps<{
  checked: boolean;
  color?: string;
  disabled?: boolean;
}>();

defineEmits<{
  toggle: [];
}>();
</script>

<style scoped>
.circle-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  min-width: 24px;
  border-radius: 50%;
  border: 2px solid var(--cb-color);
  background: transparent;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.15s ease, opacity 0.15s ease;
}

.circle-checkbox--checked {
  background-color: var(--cb-color);
}

.circle-checkbox__icon {
  color: #ffffff;
  font-size: 14px;
}

.circle-checkbox--disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
