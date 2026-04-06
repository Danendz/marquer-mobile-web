# Feature: Profile

## Purpose
User profile display and editing, avatar and cover image uploads via presigned S3/MinIO URLs.

## Directory Structure
```
profile/
  components/    # ProfileHeader, AvatarUpload, CoverUpload
  composables/   # useProfileQuery, useUpdateProfile, useUploadAvatar
  api/           # profile.api.ts — raw axios calls + query keys
  types/         # profile.types.ts — UserProfile, UpdateProfilePayload
```

## Conventions
- **API file**: `profile.api.ts` + `export const profileKeys = { ... }`
- **No Pinia store** — profile data is server state via TanStack Query
- **Types**: `profile.types.ts`
- Also includes achievements and notifications as sub-concerns

## API Endpoints
- `GET /profile` — get user profile
- `PUT /profile` — update profile
- `POST /profile/avatar/upload-url` — get presigned URL for avatar
- `POST /profile/cover/upload-url` — get presigned URL for cover
- `GET /achievements` — list achievements

## Related Pages
- `src/pages/profile/EditProfilePage.vue`
- `src/pages/me/MePage.vue` (composes profile summary)
