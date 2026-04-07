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

## Client Logic to Implement

### Rich Text Editor
Flutter ref: `lib/components/note_editor/note_editor.dart`

Content stored as **Quill Delta JSON** in the database. Library choice TBD — options:
- `quill` — direct Delta JSON compatibility, no migration needed
- `tiptap` — better Vue integration, but different format (would need converter or migration)

**Serialization:**
- Save: `JSON.stringify(editor.getContents())`
- Load: `editor.setContents(JSON.parse(content))`

### Editor Toolbar
- **Top bar**: Clear formatting, Undo, Redo, Save button (with loading spinner)
- **Bottom bar** (horizontally scrollable): Checklist, Ordered list, Bullet list, Underline, Bold, Italic, Align (left, center, right)
