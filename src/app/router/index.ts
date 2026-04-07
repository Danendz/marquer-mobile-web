import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { ROUTE_NAMES, ROUTE_PATHS } from '@/shared/constants/routes';
import { authGuard } from '@/app/router/guards';

const routes: Array<RouteRecordRaw> = [
  // Public routes (no tabs)
  {
    path: ROUTE_PATHS.LOGIN,
    name: ROUTE_NAMES.LOGIN,
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: ROUTE_PATHS.REGISTER,
    name: ROUTE_NAMES.REGISTER,
    component: () => import('@/pages/auth/RegisterPage.vue'),
    meta: { requiresAuth: false },
  },

  // Tabbed routes (inside AppLayout shell)
  {
    path: '/',
    component: () => import('@/shared/components/AppLayout.vue'),
    children: [
      {
        path: '',
        name: ROUTE_NAMES.HOME,
        component: () => import('@/pages/home/HomePage.vue'),
      },
      {
        path: 'notes',
        name: ROUTE_NAMES.NOTES,
        component: () => import('@/pages/notes/NotesPage.vue'),
      },
      {
        path: 'notes/:id',
        name: ROUTE_NAMES.NOTE_EDITOR,
        component: () => import('@/pages/notes/NoteEditorPage.vue'),
      },
      {
        path: 'calendar',
        name: ROUTE_NAMES.CALENDAR,
        component: () => import('@/pages/calendar/CalendarPage.vue'),
      },
    ],
  },

  // Full-screen routes (no tabs)
  {
    path: ROUTE_PATHS.TASKS,
    name: ROUTE_NAMES.TASKS,
    component: () => import('@/pages/tasks/TasksPage.vue'),
  },
  {
    path: ROUTE_PATHS.MANAGE_FOLDERS,
    name: ROUTE_NAMES.MANAGE_FOLDERS,
    component: () => import('@/pages/tasks/ManageFoldersPage.vue'),
  },
  {
    path: ROUTE_PATHS.ACTIVE_SESSION,
    name: ROUTE_NAMES.ACTIVE_SESSION,
    component: () => import('@/pages/study/ActiveSessionPage.vue'),
  },
  {
    path: ROUTE_PATHS.STUDY_STATS,
    name: ROUTE_NAMES.STUDY_STATS,
    component: () => import('@/pages/study/StatsPage.vue'),
  },
  {
    path: ROUTE_PATHS.SUBJECTS,
    name: ROUTE_NAMES.SUBJECTS,
    component: () => import('@/pages/study/SubjectsPage.vue'),
  },
  {
    path: ROUTE_PATHS.PLAN_FORM,
    name: ROUTE_NAMES.PLAN_FORM,
    component: () => import('@/pages/calendar/PlanFormPage.vue'),
  },
  {
    path: ROUTE_PATHS.COUNTDOWN_DETAIL,
    name: ROUTE_NAMES.COUNTDOWN_DETAIL,
    component: () => import('@/pages/calendar/CountdownDetailPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(authGuard);

export default router;
