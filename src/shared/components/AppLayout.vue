<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/">
          <ion-icon :icon="home" aria-hidden="true" />
          <ion-label>Home</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="notes" href="/notes">
          <ion-icon :icon="documentText" aria-hidden="true" />
          <ion-label>Notes</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="calendar" href="/calendar">
          <ion-icon :icon="calendarOutline" aria-hidden="true" />
          <ion-label>Calendar</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="me" href="/me">
          <ion-icon :icon="personOutline" aria-hidden="true" />
          <ion-label>Me</ion-label>
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
import { home, documentText, calendarOutline, personOutline } from 'ionicons/icons';
</script>
