# Feature: Tasks

## Purpose
Task management with CRUD operations, folder organization, category filtering, and status tracking.

## Directory Structure
```
tasks/
  components/    # TaskCard, TaskList, TaskFilters, FolderList (TBD)
  composables/   # useTasksQuery, useTaskFoldersQuery, 9 mutation composables
  api/           # tasks.api.ts — raw axios calls + query keys
  types/         # tasks.types.ts — Task, TaskFolder, TaskCategory, enums, payloads
  __tests__/     # Unit tests for composables and API functions
```

## Implemented Files
- `types/tasks.types.ts` — TaskFolder, TaskCategory, Task, TaskStatus enum, all payloads
- `api/tasks.api.ts` — 11 API functions + `tasksKeys` query key factory
- `composables/useTaskFoldersQuery.ts` — folders list (stale: LONG)
- `composables/useTasksQuery.ts` — tasks list with reactive params (stale: MEDIUM)
- `composables/useCreateTaskFolderMutation.ts`
- `composables/useUpdateTaskFolderMutation.ts`
- `composables/useDeleteTaskFolderMutation.ts`
- `composables/useCreateTaskCategoryMutation.ts`
- `composables/useUpdateTaskCategoryMutation.ts`
- `composables/useDeleteTaskCategoryMutation.ts`
- `composables/useCreateTaskMutation.ts`
- `composables/useUpdateTaskMutation.ts`
- `composables/useDeleteTaskMutation.ts`

## Conventions
- **API file**: `tasks.api.ts` + `export const tasksKeys = { ... }`
- **Query composables**: `useTasksQuery.ts`, `useCreateTaskMutation.ts`, etc.
- **Types**: `tasks.types.ts`
- **No Pinia store** — task list is server state managed by TanStack Query; filters can use local `ref()`

## API Endpoints
- `GET /tasks` — list tasks (query: status, task_category_id, task_folder_id, date)
- `POST /tasks` — create task
- `PUT /tasks/{id}` — update task
- `DELETE /tasks/{id}` — delete task
- `GET /task-folders` — list folders (includes nested categories)
- `POST /task-folders` — create folder
- `PUT /task-folders/{id}` — update folder
- `DELETE /task-folders/{id}` — delete folder
- `POST /task-categories` — create category
- `PUT /task-categories/{id}` — update category
- `DELETE /task-categories/{id}` — delete category

## Related Pages
- `src/pages/tasks/TasksPage.vue`
- `src/pages/tasks/ManageFoldersPage.vue`

## Client Logic to Implement

### Task Status Transitions
- `toggleTaskStatus()`: `draft` ↔ `done` (ignores `progress`)
- `deleteTask()`: sets status to `cancelled` (soft delete)
- `restoreTask()`: `cancelled` → `draft`
- `permanentlyDelete()`: actual API DELETE call

**UI filtering logic:**
- Active tasks: `status !== 'done' && status !== 'cancelled'`
- Completed section: `status === 'done'` (collapsible, hidden when empty)
- Deleted view: `status === 'cancelled'`

### Task Time Auto-Adjustment
Flutter ref: `lib/components/shared/task_edit_sheet.dart`
- Setting start time auto-sets end time to `start + 60 min` (if no end time yet)
- End time clamped to max `23:59`
- End time validation: must be > start time (reject otherwise)
- End time picker only enabled if start time is set

### Inline Task Creation (Optimistic)
- Create with negative ID (`-Date.now()`) before API response
- Focus blur on input triggers trim + save
- `suppressStopOnFocusLoss` flag prevents premature saves during rapid entry
- On API success: replace optimistic task with server response

### Category Dual-Keying (Unsaved Entities)
Flutter ref: `lib/providers/tasks/task_folders_provider.dart`

New unsaved categories get `tempUUID` (client-generated). All state lookups use:
```
isNew ? category.tempUUID === id : category.id === id
```
On save → API response replaces temp category with real one. Prevents adding if one is already being created.

### Filter Smart Ordering
When a category filter is active, its parent folder moves to top of the filter dropdown list and auto-expands.

### Key Flutter Reference Files
| File | Lines | What |
|------|-------|------|
| `lib/providers/tasks/task_folders_provider.dart` | ~250 | Folder/category state with dual-keying |
| `lib/components/shared/task_edit_sheet.dart` | ~200 | Task edit form with time validation |
| `lib/providers/tasks/tasks_provider.dart` | ~200 | Task CRUD with optimistic updates |
