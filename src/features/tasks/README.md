# Feature: Tasks

## Purpose
Task management with CRUD operations, folder organization, category filtering, and status tracking.

## Directory Structure
```
tasks/
  components/    # TaskCard, TaskList, TaskFilters, FolderList
  composables/   # useTasksQuery, useCreateTask, useTaskFolders
  api/           # tasks.api.ts — raw axios calls + query keys
  types/         # tasks.types.ts — Task, TaskFolder, TaskCategory, TaskFilter
  __tests__/     # Unit tests for composables and API functions
```

## Conventions
- **API file**: `tasks.api.ts` + `export const taskKeys = { ... }`
- **Query composables**: `useTasksQuery.ts`, `useCreateTaskMutation.ts`, etc.
- **Types**: `tasks.types.ts`
- **No Pinia store** — task list is server state managed by TanStack Query; filters can use local `ref()`

## API Endpoints
- `GET /tasks` — list tasks (query: status, categoryId, folderId)
- `POST /tasks` — create task
- `PUT /tasks/{id}` — update task
- `DELETE /tasks/{id}` — delete task
- `GET /task-folders` — list folders
- `POST /task-folders` — create folder
- `PUT /task-folders/{id}` — update folder
- `DELETE /task-folders/{id}` — delete folder
- `POST /task-categories` — create category
- `PUT /task-categories/{id}` — update category
- `DELETE /task-categories/{id}` — delete category

## Related Pages
- `src/pages/tasks/TasksPage.vue`
- `src/pages/tasks/ManageFoldersPage.vue`
