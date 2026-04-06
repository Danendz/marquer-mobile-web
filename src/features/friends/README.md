# Feature: Friends

## Purpose
Friend system: sending/receiving friend requests, searching users, managing friend list, invite codes.

## Directory Structure
```
friends/
  components/    # FriendCard, FriendRequestCard, UserSearch
  composables/   # useFriendsQuery, useFriendRequests, useSendRequest
  api/           # friends.api.ts — raw axios calls + query keys
  types/         # friends.types.ts — Friend, FriendRequest, FriendshipStatus
```

## Conventions
- **API file**: `friends.api.ts` + `export const friendKeys = { ... }`
- **No Pinia store** — friends are server state via TanStack Query
- **Types**: `friends.types.ts`

## API Endpoints
- `GET /friends` — list friends
- `GET /friends/requests` — list pending friend requests
- `POST /friends/request` — send friend request
- `PUT /friends/request/{id}` — accept/decline friend request
- `DELETE /friends/{id}` — remove friend
- `GET /friends/search` — search users

## Related Pages
- `src/pages/friends/FriendsPage.vue`
