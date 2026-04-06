# CLAUDE.md

## Project Stack
- Ionic 8 + Vue 3 (Composition API with `<script setup>`)
- Capacitor 8 for native functionality
- TypeScript strict mode
- Pinia for state management
- Vue Router via @ionic/vue-router
- TanStack Query + axios for data fetching
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

## Coding Rules

### Vue Components
- ALWAYS use `<script setup lang="ts">` — never Options API
- ALWAYS use Composition API (ref, computed, watch, onMounted)
- Use defineProps/defineEmits with TypeScript generics

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

### Data Fetching
- Use TanStack Query (`useQuery`, `useMutation`) for all API calls
- Use axios for HTTP requests
- Keep API functions in `src/api/` directory
- Use Pinia stores for client-side state only (not server state)

### Common Mistakes to Avoid
- Do NOT use `<ion-back-button>` without `defaultHref` prop
- Do NOT forget to call `register()` after `requestPermissions()`
  for push notifications
- Do NOT use `localStorage` in Ionic — use `@capacitor/preferences`
- Do NOT use `fetch` for local files — use `@capacitor/filesystem`
- Do NOT wrap `ion-content` inside a div — it must be a direct
  child of `ion-page`
- Do NOT use `v-if` on `ion-page` — it breaks Ionic's page lifecycle

## Unimplemented API Endpoints

When a feature requires a backend endpoint that doesn't exist yet:

1. Add a `// TODO(api): <description>` comment at the call site
2. Log a console warning: `[API STUB] <endpoint> is not implemented yet`
3. Use mock/fake data so the UI is fully functional
4. Add the stub to `src/api/STUBS.md` so the backend dev knows what to build

See `src/api/STUBS.md` for the running list of all API stubs.
