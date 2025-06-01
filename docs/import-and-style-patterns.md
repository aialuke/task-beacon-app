# Import Patterns and Styling Guidelines

This document covers import organization, styling patterns, and file structure guidelines.

## Import Order and Patterns

### Standardized Import Order

1. React and React-related imports
2. Third-party libraries
3. UI components (from `@/components/ui`)
4. Business components (from `@/components/business`)
5. Feature components
6. Hooks (context, queries, mutations, custom)
7. Utilities (direct imports preferred)
8. Types and interfaces
9. Assets and styles

### Import Pattern Standards

#### 1. Direct Imports (Preferred)

```typescript
import { formatDate } from '@/lib/utils/date';
import { compressAndResizePhoto } from '@/lib/utils/image';
import { useTaskMutations } from '@/features/tasks/hooks/useTaskMutations';
```

#### 2. Feature Imports

```typescript
import { TaskCard } from '@/features/tasks/components/TaskCard';
import { useTaskDataContext } from '@/features/tasks/context/TaskDataContext';
import { useTaskUIContext } from '@/features/tasks/context/TaskUIContext';
import { TaskProviders } from '@/features/tasks/providers/TaskProviders';
```

#### 3. Type Imports

```typescript
import { Task, TaskStatus, TaskFilter } from '@/types';
import { ApiResponse, ApiError } from '@/types';
```

## Context Boundaries

### Strict Context Separation

- **Data Context**: Task queries, mutations, and data operations
- **UI Context**: Filters, expanded state, mobile detection
- **Auth Context**: User authentication and session management

### Context Usage Guidelines

```tsx
// ✅ Correct: Use specific context hooks
const { tasks, isLoading } = useTaskDataContext();
const { filter, setFilter } = useTaskUIContext();

// ✅ Provider composition with TaskProviders
<TaskProviders>
  <TaskDashboard />
</TaskProviders>

// ❌ Avoid: Mixed concerns in single context
```

### Context Provider Patterns

```tsx
// ✅ Recommended: Use TaskProviders for task-related components
import { TaskProviders } from '@/features/tasks/providers/TaskProviders';

function App() {
  return (
    <TaskProviders>
      <TaskDashboard />
    </TaskProviders>
  );
}

// ✅ Alternative: Direct context imports when needed
import { useTaskDataContext } from '@/features/tasks/context/TaskDataContext';
import { useTaskUIContext } from '@/features/tasks/context/TaskUIContext';

function TaskComponent() {
  const { tasks, isLoading } = useTaskDataContext();
  const { filter, setFilter } = useTaskUIContext();
  
  return <div>...</div>;
}
```

## Hook Organization

### Hook Categories

- **State Hooks**: `useTaskFormState` - Basic state management
- **Composition Hooks**: `useTaskForm` - Combines multiple concerns
- **Validation Hooks**: `useTaskFormValidation` - Validation logic
- **Mutation Hooks**: `useCreateTask` - Data operations
- **Context Hooks**: `useTaskDataContext`, `useTaskUIContext` - Context consumption

### Hook Composition Pattern

```tsx
export function useComplexForm() {
  const state = useFormState();
  const validation = useFormValidation();
  const upload = usePhotoUpload();

  return {
    ...state,
    ...validation,
    ...upload,
  };
}
```

### Context Hook Error Handling

```tsx
export function useTaskDataContext() {
  const context = useContext(TaskDataContext);
  if (context === undefined) {
    throw new Error(
      'useTaskDataContext must be used within a TaskDataContextProvider'
    );
  }
  return context;
}
```

## Animation and Styling

### CSS Class Organization

- **Tailwind utilities**: Primary styling approach
- **Component-specific styles**: In dedicated CSS files
- **Animation classes**: Defined in utilities/animations.css

### Animation Patterns

- **CSS transitions**: For simple state changes
- **React Spring**: For complex animations
- **Performance**: Use `transform` and `opacity` properties

### Conditional Styling with cn Utility

```tsx
import { cn } from '@/lib/utils';

const TaskCard = ({ isActive, isPinned }) => (
  <div
    className={cn(
      'rounded-lg border bg-card p-4 shadow-sm transition-colors',
      isActive && 'border-primary bg-primary/5',
      isPinned && 'border-l-4 border-l-yellow-500'
    )}
  >
    {/* Content */}
  </div>
);
```

## File Organization

- **Small files**: Prefer multiple small files over large ones
- **Single responsibility**: One main export per file
- **Clear naming**: File names should match their primary export
- **Feature grouping**: Group related files in feature directories

### Current Feature Structure

```
src/features/tasks/
├── components/
│   ├── TaskCard.tsx
│   ├── TaskList.tsx
│   └── TaskDashboard.tsx
├── context/
│   ├── TaskDataContext.tsx
│   └── TaskUIContext.tsx
├── providers/
│   └── TaskProviders.tsx    // ✅ New centralized provider
├── hooks/
│   ├── useTaskCard.ts
│   └── useTaskMutations.ts
└── types/
    └── task.types.ts
```

## Migration Guidelines

### When Refactoring Components

1. **Update imports** to use standardized utils from `@/lib/utils/`
2. **Use TaskProviders** for provider composition
3. **Use direct context imports** (`useTaskDataContext`, `useTaskUIContext`)
4. **Maintain hook compatibility** - existing hook usage continues to work
5. **Test thoroughly** to ensure no breaking changes

### Example Migration

```diff
// Before: Individual providers
- import { TaskDataContextProvider } from '@/features/tasks/context/TaskDataContext';
- import { TaskUIContextProvider } from '@/features/tasks/context/TaskUIContext';

// After: Consolidated provider
+ import { TaskProviders } from '@/features/tasks/providers/TaskProviders';

function App() {
  return (
-   <TaskDataContextProvider>
-     <TaskUIContextProvider>
-       <TaskDashboard />
-     </TaskUIContextProvider>
-   </TaskDataContextProvider>
+   <TaskProviders>
+     <TaskDashboard />
+   </TaskProviders>
  );
}
```

## Testing Patterns

### Provider Testing

```tsx
import { renderWithTaskProviders } from '@/lib/testing/context-helpers';

describe('TaskComponent', () => {
  it('renders with task providers', () => {
    renderWithTaskProviders(<TaskComponent />);
    // Test implementation
  });
});
```

### Hook Testing

```tsx
import { renderHook } from '@testing-library/react';
import { TaskProviders } from '@/features/tasks/providers/TaskProviders';

describe('useTaskDataContext', () => {
  it('provides task data', () => {
    const wrapper = ({ children }) => (
      <TaskProviders>{children}</TaskProviders>
    );
    
    const { result } = renderHook(() => useTaskDataContext(), { wrapper });
    expect(result.current.tasks).toBeDefined();
  });
});
```

---

This guide ensures consistent, maintainable, and performant code across the Task Beacon application following the established state management guidelines.
