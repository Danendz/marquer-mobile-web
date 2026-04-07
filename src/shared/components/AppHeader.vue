<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <ion-buttons v-if="$slots.start" slot="start">
        <slot name="start" />
      </ion-buttons>
      <ion-title>{{ title }}</ion-title>
      <ion-buttons v-if="$slots.end" slot="end">
        <slot name="end" />
      </ion-buttons>
    </ion-toolbar>
    <slot />
  </ion-header>
</template>

<script setup lang="ts">
import { IonHeader, IonToolbar, IonTitle, IonButtons } from '@ionic/vue';

defineProps<{
  title: string;
}>();
</script>

<style scoped>
ion-title {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
}
</style>
