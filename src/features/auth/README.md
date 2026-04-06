# Feature: Auth

## Purpose
Handles user authentication: login, registration, token management, and session state.

## Directory Structure
```
auth/
  components/    # Login/register form components
  composables/   # useLoginMutation, useRegisterMutation
  api/           # auth.api.ts — raw axios calls to auth service
  store/         # auth.store.ts — Pinia store for token, user, auth status
  types/         # auth.types.ts — User, AuthResponse, LoginPayload, etc.
```

## Conventions
- **API file**: `auth.api.ts` — calls go to `authClient` (separate auth service)
- **Store**: `auth.store.ts` — one of the few features that needs Pinia (global auth state)
- **Query composables**: `useLoginMutation.ts`, `useRegisterMutation.ts`
- **Types**: `auth.types.ts`
- **Cross-feature**: Auth store is imported by `shared/api/client.ts` via callbacks

## API Endpoints (auth service)
- `POST /auth/login` — login with email/password
- `POST /auth/register` — register new user
- `POST /auth/refresh` — refresh JWT token
- `GET /auth/me` — get current user
- `POST /auth/logout` — logout

## Related Pages
- `src/pages/auth/LoginPage.vue`
- `src/pages/auth/RegisterPage.vue`
