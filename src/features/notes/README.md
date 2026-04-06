# Feature: Notes

## Purpose
Rich text note management with create, read, update, and delete operations.

## Directory Structure
```
notes/
  components/    # NoteCard, NoteEditor (TBD)
  composables/   # 2 query + 3 mutation composables
  api/           # notes.api.ts — raw axios calls + query keys
  types/         # notes.types.ts — Note, ListNote, payloads
  __tests__/     # Unit tests
```

## Implemented Files
- `types/notes.types.ts` — Note, ListNote, CreateNotePayload, UpdateNotePayload
- `api/notes.api.ts` — 5 API functions + `notesKeys` query key factory
- `composables/useNotesQuery.ts` — notes list (stale: MEDIUM)
- `composables/useNoteQuery.ts` — single note with reactive id (stale: MEDIUM)
- `composables/useCreateNoteMutation.ts`
- `composables/useUpdateNoteMutation.ts`
- `composables/useDeleteNoteMutation.ts`

## Conventions
- **API file**: `notes.api.ts` + `export const notesKeys = { ... }`
- **No Pinia store** — notes are server state via TanStack Query
- **Types**: `notes.types.ts`

## API Endpoints
- `GET /notes` — list notes (returns ListNote without content)
- `GET /notes/{id}` — get note details (returns full Note with content)
- `POST /notes` — create note
- `PUT /notes/{id}` — update note
- `DELETE /notes/{id}` — delete note

## Related Pages
- `src/pages/notes/NotesPage.vue`
- `src/pages/notes/NoteEditorPage.vue`
