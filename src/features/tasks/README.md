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
