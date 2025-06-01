# Naming Conventions

## 📋 Overview

Consistent naming conventions improve code readability, maintainability, and developer experience across the Task Beacon application.

## 🏷️ General Guidelines

- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase with descriptive auxiliary verbs
- **Constants**: SCREAMING_SNAKE_CASE
- **Hooks**: camelCase with `use` prefix (e.g., `useTaskDataContext`, `useTaskMutations`)
- **Types**: PascalCase (interfaces and types)
- **Contexts**: PascalCase ending with "Context"

## 📁 File Naming

### Components
```
TaskCard.tsx          // Component files
TaskDashboard.tsx     // Main feature components
CreateTaskPage.tsx    // Page components
```

### Utilities and Hooks
```
dateUtils.ts          // Utility functions
imageUtils.ts         // Utility functions
useTaskCard.ts        // Custom hooks
useTaskMutations.ts   // Custom hooks
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
useTaskMutations.test.ts    // Hook tests
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

---

These conventions ensure consistency and clarity across the Task Beacon codebase, making it easier for developers to understand and maintain the application.
