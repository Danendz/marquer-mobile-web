<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <ion-icon :icon="icon" class="text-6xl text-gray-400 mb-4" />
    <h3 class="text-lg font-medium text-gray-600">{{ title }}</h3>
    <p v-if="description" class="text-sm text-gray-400 mt-1">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';

defineProps<{
  icon: string;
  title: string;
  description?: string;
}>();
</script>
