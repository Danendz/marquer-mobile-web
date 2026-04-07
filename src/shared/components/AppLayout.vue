<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/">
          <ion-icon :icon="mdiHome" aria-hidden="true" />
          <ion-label>Home</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="notes" href="/notes">
          <ion-icon :icon="mdiNote" aria-hidden="true" />
          <ion-label>Notes</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="calendar" href="/calendar">
          <ion-icon :icon="mdiCalendarMonth" aria-hidden="true" />
          <ion-label>Calendar</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/vue';
import { mdiHome, mdiNote, mdiCalendarMonth } from '@/shared/icons/material';
</script>
