<template>
  <ion-page>
    <AppHeader title="Sign In" />
    <ion-content class="ion-padding">
      <div class="auth-container">
        <form @submit.prevent="handleLogin">
          <ion-list>
            <ion-item>
              <ion-input
                v-model="form.email"
                label="Email"
                label-placement="floating"
                type="email"
                inputmode="email"
                autocomplete="email"
              />
            </ion-item>

            <ion-item>
              <ion-input
                v-model="form.password"
                label="Password"
                label-placement="floating"
                type="password"
                autocomplete="current-password"
              />
            </ion-item>
          </ion-list>

          <ion-button
            expand="block"
            type="submit"
            class="ion-margin-top"
            :disabled="loginMutation.isPending.value"
          >
            <ion-spinner v-if="loginMutation.isPending.value" name="crescent" />
            <span v-else>Sign In</span>
          </ion-button>
        </form>

        <p class="auth-link">
          Don't have an account?
          <router-link :to="ROUTE_PATHS.REGISTER">Sign Up</router-link>
        </p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonSpinner,
} from '@ionic/vue';
import AppHeader from '@/shared/components/AppHeader.vue';
import { useLoginMutation } from '@/features/auth/composables/useLoginMutation';
import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/constants/routes';

const router = useRouter();
const loginMutation = useLoginMutation();

const form = reactive({
  email: '',
  password: '',
});

function handleLogin() {
  loginMutation.mutate(form, {
    onSuccess: () => {
      router.replace({ name: ROUTE_NAMES.HOME });
    },
  });
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding-top: 40px;
}

.auth-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: var(--color-on-surface-variant);
}

.auth-link a {
  color: var(--ion-color-primary);
  text-decoration: none;
  font-weight: 500;
}
</style>
