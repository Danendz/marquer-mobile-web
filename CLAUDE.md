# CLAUDE.md

## Project Stack
- Ionic 8 + Vue 3 (Composition API with `<script setup>`)
- Capacitor 8 for native functionality
- TypeScript strict mode
- Pinia for client-side state only (auth, timer, UI prefs)
- TanStack Query for all server state (fetch, cache, mutations)
- Vue Router via @ionic/vue-router
- axios for HTTP requests
- Tailwind CSS for styling
- VueUse (core, motion, gesture) for utilities/animations
- Ionicons + @iconify/vue for icons

## Quick Reference Commands
```bash
pnpm dev                    # start dev server (browser)
pnpm build                  # type-check + production build
pnpm lint                   # run ESLint
pnpm lint:fix               # run ESLint with auto-fix
pnpm format                 # format with Prettier
pnpm test:unit              # run unit tests (vitest)
pnpm test:e2e               # run e2e tests (cypress)
pnpm exec cap sync          # sync web build to native platforms
pnpm exec cap run android   # run on Android device/emulator
```

## Architecture Overview

This project uses a **4-layer feature-based architecture**:

```
src/
  app/           # App bootstrap, router, guards
  pages/         # Thin route shells (Ionic layout + route params, NO logic)
  features/      # Domain logic colocated by feature
  shared/        # Cross-cutting concerns used by 2+ features
  theme/         # CSS variables and Tailwind entry
```

Each feature (auth, tasks, study, calendar, notes, profile, friends, settings) has:
```
features/{name}/
  components/    # Vue components private to this feature
  composables/   # useXxxQuery, useXxxMutation composables
  api/           # {name}.api.ts — raw axios calls + query keys
  store/         # {name}.store.ts — Pinia store (only if client-side state needed)
  types/         # {name}.types.ts — interfaces, enums, payload types
  __tests__/     # Vitest unit tests (colocated)
  README.md      # Feature purpose, conventions, API endpoints
```

**Read the feature's README.md before modifying any feature.**

## Where Things Go

| What | Where |
|------|-------|
| Route definitions | `src/app/router/index.ts` |
| Auth guard | `src/app/router/guards.ts` |
| Page shells | `src/pages/{domain}/{Name}Page.vue` |
| Feature components | `src/features/{feature}/components/` |
| API functions | `src/features/{feature}/api/{feature}.api.ts` |
| TanStack queries | `src/features/{feature}/composables/use{Entity}Query.ts` |
| TanStack mutations | `src/features/{feature}/composables/use{Action}Mutation.ts` |
| Pinia stores | `src/features/{feature}/store/{feature}.store.ts` |
| Feature types | `src/features/{feature}/types/{feature}.types.ts` |
| Shared components | `src/shared/components/` |
| Axios client | `src/shared/api/client.ts` |
| API response types | `src/shared/api/types.ts` |
| Route constants | `src/shared/constants/routes.ts` |
| Utility functions | `src/shared/utils/` |
| Unit tests | `src/features/{feature}/__tests__/` or colocated in sub-folders |

## File Naming Conventions

- **Components**: `PascalCase.vue` (e.g., `TaskCard.vue`, `EmptyState.vue`)
- **Composables**: `useCamelCase.ts` with `use` prefix (e.g., `useTasksQuery.ts`)
- **API files**: `{feature}.api.ts` (e.g., `tasks.api.ts`)
- **Store files**: `{feature}.store.ts` (e.g., `auth.store.ts`)
- **Type files**: `{feature}.types.ts` (e.g., `tasks.types.ts`)
- **Pages**: `PascalCasePage.vue` (e.g., `TasksPage.vue`, `LoginPage.vue`)

## Import Rules

- **Direct deep imports only** — no barrel exports (index.ts) files
  ```typescript
  // GOOD
  import TaskCard from '@/features/tasks/components/TaskCard.vue';
  import { useTasksQuery } from '@/features/tasks/composables/useTasksQuery';

  // BAD — no barrels
  import { TaskCard } from '@/features/tasks';
  ```
- **No auto-imports** — everything must be explicitly imported
- **Cross-feature rules**:
  - Types and composables: CAN be imported across features
  - Components: MUST stay private to their feature (shared UI → `shared/components/`)

## Coding Rules

### Vue Components
- ALWAYS use `<script setup lang="ts">` — never Options API
- ALWAYS use Composition API (ref, computed, watch, onMounted)
- Use defineProps/defineEmits with TypeScript generics
- One component per file, always

### Ionic Specifics
- Every page component MUST be wrapped in `<ion-page>`
- Use `<ion-header>`, `<ion-content>`, `<ion-footer>` for page structure
- NEVER use Cordova plugins — use Capacitor equivalents only
- Import icons from ionicons/icons: `import { heart, add } from 'ionicons/icons'`
- Use the Ionic lifecycle hooks (`onIonViewWillEnter`, `onIonViewDidLeave`)
  instead of Vue's onMounted/onUnmounted for page-level logic

### Styling
- Ionic components use Shadow DOM — do NOT try to style internal
  elements with regular CSS selectors
- Use CSS variables (`--background`, `--color`, `--border-radius`) to
  customize Ionic components
- Use `::part()` selectors when CSS variables aren't enough
- Global theme goes in `src/theme/variables.css`
- Use Tailwind CSS utility classes for layout and custom styling
- Use scoped styles in components

### Navigation
- Use `router.push()` or `<router-link>` for navigation
- Use `useIonRouter()` for Ionic-specific navigation with transitions
- Tab-based navigation uses `<ion-tabs>` with `<ion-router-outlet>`
- 3 tabs: Home (`/`), Notes (`/notes`), Calendar (`/calendar`)
- Full-screen routes (no tabs): `/tasks`, `/study/*`, `/calendar/plan/*`, `/calendar/countdown/*`

### Data Fetching (Composable-First Pattern)
- **API files** (`features/*/api/*.api.ts`): raw axios calls only, export named functions
- **Query keys**: defined in the `.api.ts` file as `export const {feature}Keys = { ... }`
- **Composables** (`features/*/composables/use*Query.ts`): TanStack Query wrappers
- Use TanStack Query (`useQuery`, `useMutation`) for all server state
- Use Pinia stores for client-side state only (auth token, active timer, UI prefs)
- Centralized error handling via axios interceptor — mutations can override with `onError`

### TypeScript
- No `any` — use proper types
- No `as` casts except at API boundaries (parsing raw responses)
- All feature types go in `features/{feature}/types/{feature}.types.ts`

### Common Mistakes to Avoid
- Do NOT use `<ion-back-button>` without `defaultHref` prop
- Do NOT forget to call `register()` after `requestPermissions()`
  for push notifications
- Do NOT use `localStorage` in Ionic — use `@capacitor/preferences`
- Do NOT use `fetch` for local files — use `@capacitor/filesystem`
- Do NOT wrap `ion-content` inside a div — it must be a direct
  child of `ion-page`
- Do NOT use `v-if` on `ion-page` — it breaks Ionic's page lifecycle
- Do NOT import the auth store directly in `shared/api/client.ts` — use the callback pattern

## Unimplemented API Endpoints

When a feature requires a backend endpoint that doesn't exist yet:

1. Add a `// TODO(api): <description>` comment at the call site
2. Log a console warning: `[API STUB] <endpoint> is not implemented yet`
3. Use mock/fake data so the UI is fully functional
4. Add the stub to `src/shared/api/STUBS.md` so the backend dev knows what to build

See `src/shared/api/STUBS.md` for the running list of all API stubs.
