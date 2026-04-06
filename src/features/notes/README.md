# Feature: Notes

## Purpose
Rich text note management with create, read, update, and delete operations.

## Directory Structure
```
notes/
  components/    # NoteCard, NoteEditor
  composables/   # useNotesQuery, useNoteMutation
  api/           # notes.api.ts — raw axios calls + query keys
  types/         # notes.types.ts — Note, ListNote, CreateNotePayload
  __tests__/     # Unit tests
```

## Conventions
- **API file**: `notes.api.ts` + `export const noteKeys = { ... }`
- **No Pinia store** — notes are server state via TanStack Query
- **Types**: `notes.types.ts`

## API Endpoints
- `GET /notes` — list notes
- `GET /notes/{id}` — get note details
- `POST /notes` — create note
- `PUT /notes/{id}` — update note
- `DELETE /notes/{id}` — delete note

## Related Pages
- `src/pages/notes/NotesPage.vue`
- `src/pages/notes/NoteEditorPage.vue`
