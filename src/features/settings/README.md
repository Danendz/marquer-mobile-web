# Feature: Settings

## Purpose
User preferences and app settings management (theme, notifications, general preferences).

## Directory Structure
```
settings/
  components/    # SettingsToggle, ThemePicker
  composables/   # useSettingsQuery, useUpdateSettings
  api/           # settings.api.ts — raw axios calls + query keys
  store/         # settings.store.ts — Pinia store for UI preferences (theme, etc.)
  types/         # settings.types.ts — UserSettings, SettingsPayload
```

## Conventions
- **API file**: `settings.api.ts` + `export const settingsKeys = { ... }`
- **Store**: `settings.store.ts` — needed for client-side UI state (theme mode, etc.)
- **Types**: `settings.types.ts`

## API Endpoints
- `GET /settings` — get user settings
- `PUT /settings` — update settings

## Related Pages
- `src/pages/settings/SettingsPage.vue`
