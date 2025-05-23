
# Supabase Integration

This document outlines how the Task Management application integrates with Supabase for backend functionality.

## Overview

Supabase provides the backend infrastructure for this application, handling:

1. User authentication and session management
2. Task data storage and retrieval
3. File storage for task images
4. Real-time updates (when enabled)

## Architecture

The Supabase integration follows a layered approach:

```
src/integrations/supabase/
├── client.ts              # Supabase client configuration
├── types/                 # Type definitions
│   ├── api.types.ts       # API response types
│   └── index.ts           # Database types
└── api/                   # API functions
    ├── base.api.ts        # Shared utilities
    ├── tasks.api.ts       # Task-specific API
    └── users.api.ts       # User-specific API
```

## Client Configuration

The Supabase client is configured in `src/integrations/supabase/client.ts` and exported as a singleton. This ensures consistent usage throughout the application.

Key features:
- Persistent session storage
- Auto-refreshing tokens
- Development mode with mock data

## API Layer

The API layer provides a standardized interface for interacting with Supabase:

1. **Base API** (`base.api.ts`)
   - Error handling utilities
   - Current user utilities
   - Generic request wrapper

2. **Tasks API** (`tasks.api.ts`)
   - CRUD operations for tasks
   - Task status updates
   - Task relationship management
   - Photo upload handling

3. **Users API** (`users.api.ts`)
   - User profile operations
   - User search functionality

## Error Handling

The API layer includes standardized error handling:

1. All API functions use the `apiRequest` wrapper
2. Errors are normalized via `handleApiError`
3. Standardized `TablesResponse<T>` type for consistent return values

## Mock Mode

For development without a Supabase backend, the application includes:

1. `isMockingSupabase` flag in `client.ts`
2. Mock data arrays in API files
3. Conditional logic to return mock data when flag is enabled

## Type Safety

The integration uses TypeScript extensively:

1. `Database` type from generated Supabase types
2. `Tables` interface for table schemas
3. `TablesResponse<T>` for consistent API responses
4. `ApiError` for standardized error format

## Usage Example

```typescript
import { getAllTasks, createTask } from '@/integrations/supabase/api/tasks.api';

// Query tasks
const { data: tasks, error } = await getAllTasks();
if (error) console.error('Failed to load tasks:', error);

// Create a task
const { error: createError } = await createTask({
  title: 'New task',
  description: 'Task description',
  due_date: new Date().toISOString(),
});
```

## Authentication Flow

1. User signs in via auth provider
2. Supabase JWT stored in localStorage
3. JWT automatically included in subsequent API calls
4. Row Level Security (RLS) enforces data access rules

## Database Schema

Task table structure:
- `id`: UUID primary key
- `title`: Task title (string)
- `description`: Task description (nullable string)
- `due_date`: Due date (nullable timestamp)
- `photo_url`: URL to task photo (nullable string)
- `url_link`: Related URL (nullable string)
- `owner_id`: User ID of task creator (UUID)
- `parent_task_id`: Reference to parent task for follow-ups (nullable UUID)
- `pinned`: Whether task is pinned (boolean)
- `status`: Task status enum ("pending", "complete", "overdue")
- `assignee_id`: User ID of assignee (nullable UUID)
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## Security

Row Level Security policies enforce:
1. Users can only see their own tasks
2. Users can only modify their own tasks
3. Users can assign tasks to other users

## Storage

Task photos are stored in a dedicated "task-photos" bucket with:
1. Automatic path generation based on timestamp and filename
2. Signed URLs for secure access
3. Size and type restrictions
