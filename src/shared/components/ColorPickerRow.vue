<template>
  <div class="color-picker-row">
    <!-- Default (no color) -->
    <button
      type="button"
      class="color-circle color-circle--default"
      :class="{ 'color-circle--selected': modelValue === null }"
      @click="$emit('update:modelValue', null)"
    >
      <ion-icon v-if="modelValue === null" :icon="mdiClose" />
    </button>

    <!-- Preset colors -->
    <button
      v-for="color in PRESET_COLORS"
      :key="color"
      type="button"
      class="color-circle"
      :style="{ backgroundColor: color }"
      :class="{ 'color-circle--selected': modelValue === color }"
      @click="$emit('update:modelValue', color)"
    >
      <ion-icon v-if="modelValue === color" :icon="mdiCheck" class="color-circle__check" />
    </button>

    <!-- Custom color button -->
    <button type="button" class="color-circle color-circle--custom" @click="openCustomPicker">
      <ion-icon :icon="mdiPalette" />
    </button>

    <!-- HSL picker modal -->
    <ion-modal :is-open="showPicker" :initial-breakpoint="0.45" :breakpoints="[0, 0.45]" @did-dismiss="showPicker = false">
      <div class="custom-picker-content">
        <div class="custom-picker-header">
          <h3>Custom Color</h3>
          <ion-button fill="clear" size="small" @click="applyCustomColor">Done</ion-button>
        </div>
        <HslColorPicker v-model="customColor" />
      </div>
    </ion-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonIcon, IonModal, IonButton } from '@ionic/vue';
import { mdiCheck, mdiClose, mdiPalette } from '@/shared/icons/material';
import HslColorPicker from '@/shared/components/HslColorPicker.vue';

const PRESET_COLORS = [
  '#009688',
  '#2196F3',
  '#9C27B0',
  '#E91E63',
  '#F44336',
  '#FF5722',
  '#FFC107',
  '#4CAF50',
  '#00BCD4',
  '#795548',
];

defineProps<{
  modelValue: string | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | null];
}>();

const showPicker = ref(false);
const customColor = ref('#4A7AE8');

function openCustomPicker() {
  showPicker.value = true;
}

function applyCustomColor() {
  emit('update:modelValue', customColor.value);
  showPicker.value = false;
}
</script>

<style scoped>
.color-picker-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 0;
  -webkit-overflow-scrolling: touch;
}

.color-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-width: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.color-circle--selected {
  border-color: var(--ion-text-color);
}

.color-circle--default {
  background-color: var(--color-surface-container-highest);
  color: var(--color-on-surface-variant);
  font-size: 14px;
}

.color-circle--custom {
  background-color: var(--color-surface-container);
  color: var(--color-on-surface-variant);
  font-size: 14px;
}

.color-circle__check {
  color: #ffffff;
  font-size: 14px;
}

.custom-picker-content {
  padding: 16px;
}

.custom-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.custom-picker-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}
</style>
