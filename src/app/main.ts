import { createApp } from 'vue';
import App from '@/app/App.vue';
import router from '@/app/router/index';
import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { setupInterceptors } from '@/shared/api/client';
import { useAuthStore } from '@/features/auth/store/auth.store';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Ionic Dark Mode — disabled, default is light (matches Flutter ThemeMode.light) */
// import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import '@/theme/variables.css';

/* Tailwind CSS */
import '@/theme/tailwind.css';

const pinia = createPinia();

const app = createApp(App)
  .use(IonicVue)
  .use(pinia)
  .use(router)
  .use(VueQueryPlugin);

// Wire up axios interceptors after Pinia is installed
const authStore = useAuthStore();
setupInterceptors({
  getToken: () => authStore.token,
  setToken: (token: string) => authStore.setToken(token),
  logout: () => authStore.logout(),
});

// Load auth state from storage, then mount
router.isReady().then(async () => {
  await authStore.loadFromStorage();
  app.mount('#app');
});
