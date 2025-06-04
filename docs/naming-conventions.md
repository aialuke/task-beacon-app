
# Naming Conventions

## 📋 Overview

Consistent naming conventions improve code readability, maintainability, and developer experience across the Task Beacon application.

## 🏷️ General Guidelines

- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase with descriptive auxiliary verbs
- **Constants**: SCREAMING_SNAKE_CASE
- **Hooks**: Follow standardized pattern `use[Feature][Entity][Action]`
- **Types**: PascalCase (interfaces and types)
- **Contexts**: PascalCase ending with "Context"

## 🪝 Hook Naming Standards

### Pattern: `use[Feature][Entity][Action]`

- **Feature**: The domain/feature area (Task, User, Auth, Form, etc.)
- **Entity**: The specific entity being acted upon (optional if implied)
- **Action**: What the hook does (Query, Mutation, Filter, Navigate, etc.)

### Examples

#### Data Hooks
```typescript
useTasksQuery()        // Query tasks data
useTaskQuery(id)       // Query single task
useUsersQuery()        // Query users data
useTasksMutate()       // Mutate tasks
```

#### UI State Hooks
```typescript
useModalState()        // Generic modal state
useFormState()         // Generic form state
useAuthFormState()     // Auth-specific form state
useTaskFormState()     // Task-specific form state
```

#### Navigation Hooks
```typescript
useTasksNavigate()     // Task navigation
useUsersNavigate()     // User navigation
```

#### Processing Hooks
```typescript
useTasksFilter()       // Filter tasks
useUsersFilter()       // Filter users
useFormPhotoUpload()   // Form photo upload
useTaskPhotoUpload()   // Task photo upload
```

### Migration Examples

**Before:**
```typescript
useTaskNavigation()    // Inconsistent
useUserFilter()        // Missing feature context
useTaskDetails()       // Vague action
usePhotoUpload()       // Missing feature context
```

**After:**
```typescript
useTasksNavigate()     // Clear feature + action
useUsersFilter()       // Clear feature + action
useTaskQuery()         // Clear feature + action
useFormPhotoUpload()   // Clear feature + action
```

## 📁 File Naming

### Components
```
TaskCard.tsx          // Component files
TaskDashboard.tsx     // Main feature components
CreateTaskPage.tsx    // Page components
```

### Hooks (Following new standard)
```
useTasksQuery.ts      // use[Feature][Entity][Action]
useUsersFilter.ts     // use[Feature][Entity][Action]
useAuthFormState.ts   // use[Feature][Entity][Action]
useFormPhotoUpload.ts // use[Feature][Entity][Action]
```

### Utilities and Services
```
dateUtils.ts          // Utility functions
imageUtils.ts         // Utility functions
TaskService.ts        // Service classes
```

### Context and Providers
```
TaskDataContext.tsx   // Data context
TaskUIContext.tsx     // UI context
TaskProviders.tsx     // Provider composition
```

## 🔧 Variable Naming

### State Variables
```typescript
const [isLoading, setIsLoading] = useState(false);
const [hasError, setHasError] = useState(false);
const [selectedTask, setSelectedTask] = useState<Task | null>(null);
```

### Event Handlers
```typescript
const handleTaskCreate = () => { ... };
const handleTaskUpdate = (task: Task) => { ... };
const handleFormSubmit = (event: FormEvent) => { ... };
```

### Computed Values
```typescript
const filteredTasks = tasks.filter(task => task.status === 'pending');
const hasActiveTasks = tasks.some(task => task.status === 'in-progress');
const taskCount = tasks.length;
```

## 🎯 Context Naming

### Context Definitions
```typescript
const TaskDataContext = createContext<TaskDataContextType | undefined>(undefined);
const TaskUIContext = createContext<TaskUIContextType | undefined>(undefined);
const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

### Hook Implementations
```typescript
const useTaskDataContext = () => { ... };
const useTaskUIContext = () => { ... };
const useAuth = () => { ... };
```

## 🧪 Test Naming

### Test Files
```
TaskCard.test.tsx           // Component tests
useTasksQuery.test.ts       // Hook tests (updated naming)
taskUtils.test.ts           // Utility tests
```

### Test Descriptions
```typescript
describe('TaskCard', () => {
  it('renders task title correctly', () => { ... });
  it('handles task update on click', () => { ... });
  it('shows loading state when updating', () => { ... });
});
```

## 📦 Export Naming

### Default Exports
```typescript
// Component files - default export matches filename
export default function TaskCard() { ... }
export default function TaskDashboard() { ... }
```

### Named Exports
```typescript
// Utility files - descriptive function names
export { formatDate, parseDate } from './dateUtils';
export { compressImage, resizeImage } from './imageUtils';

// Hook files - standardized naming
export { useTasksQuery } from './useTasksQuery';
export { useUsersFilter } from './useUsersFilter';

// Context files - context and hook exports
export { TaskDataContext, useTaskDataContext };
export { TaskUIContext, useTaskUIContext };
```

## 🔄 API and Data Naming

### API Functions
```typescript
const fetchTasks = async () => { ... };
const createTask = async (task: CreateTaskData) => { ... };
const updateTask = async (id: string, updates: Partial<Task>) => { ... };
```

### Query Keys
```typescript
const TASK_QUERY_KEYS = {
  all: ['tasks'] as const,
  lists: () => [...TASK_QUERY_KEYS.all, 'list'] as const,
  list: (filters: TaskFilter) => [...TASK_QUERY_KEYS.lists(), filters] as const,
  details: () => [...TASK_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TASK_QUERY_KEYS.details(), id] as const,
};
```

## 🎨 CSS Class Naming

### Component Classes
```typescript
// Use descriptive class names with feature prefix
className="task-card"
className="task-card__header"
className="task-card__actions"

// Or use semantic Tailwind classes
className="rounded-lg border bg-card p-4"
className="flex items-center justify-between"
```

### State-Based Classes
```typescript
className={cn(
  'task-card',
  isActive && 'task-card--active',
  isLoading && 'task-card--loading'
)}
```

## 📝 Type Naming

### Interface Definitions
```typescript
interface TaskCardProps {
  task: Task;
  onUpdate?: (task: Task) => void;
}

interface TaskDataContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}
```

### Union Types
```typescript
type TaskStatus = 'pending' | 'in-progress' | 'completed';
type TaskPriority = 'low' | 'medium' | 'high';
type ViewMode = 'list' | 'grid' | 'calendar';
```

## 🔄 Migration Guide

When renaming hooks to follow the new standard:

1. **Identify the pattern**: `use[Feature][Entity][Action]`
2. **Update the hook file name**
3. **Update the hook function name**
4. **Update all import statements**
5. **Update all usage references**
6. **Add backward compatibility exports if needed**

### Example Migration

```typescript
// Before
import { useTaskNavigation } from './useTaskNavigation';

// After
import { useTasksNavigate } from './useTasksNavigate';

// With backward compatibility
export { useTasksNavigate as useTaskNavigation } from './useTasksNavigate';
```

---

These updated conventions ensure consistency and clarity across the Task Beacon codebase, making it easier for developers to understand, find, and maintain hooks and other code elements.
