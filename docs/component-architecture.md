# Component Architecture Documentation

**Phase 3.3 Documentation & Developer Experience**  
**Last Updated**: December 2024

## Overview

This document provides comprehensive guidance for the Task Beacon App component architecture, following the patterns established in Phase 1-3 improvements.

## Architecture Patterns

### Container-Presentation Pattern

Adopted in Phase 2, this pattern separates business logic from presentation logic:

#### Container Components
- **Location**: `src/features/*/containers/`
- **Purpose**: Handle data fetching, state management, and business logic
- **Example**: `TaskDetailsContainer.tsx`

```typescript
// Container Pattern
export function TaskDetailsContainer({ taskId }: { taskId: string }) {
  const { data: task, isLoading, error } = useTaskQuery(taskId);
  const navigate = useNavigate();

  const handleEdit = () => {
    // Business logic
  };

  return (
    <TaskDetailsView
      task={task}
      isLoading={isLoading}
      error={error}
      onEdit={handleEdit}
    />
  );
}
```

#### Presentation Components  
- **Location**: `src/features/*/containers/` (co-located with containers)
- **Purpose**: Handle UI rendering and user interactions
- **Example**: `TaskDetailsView.tsx`

```typescript
// Presentation Pattern
interface TaskDetailsViewProps {
  task: Task | null;
  isLoading: boolean;
  error: string | null;
  onEdit: () => void;
}

export function TaskDetailsView(props: TaskDetailsViewProps) {
  // Only UI logic and rendering
  return (
    <div>
      {/* UI components */}
    </div>
  );
}
```

### Feature-Based Organization

Each feature follows a consistent structure:

```
src/features/tasks/
├── components/          # Feature-specific UI components
│   ├── cards/          # Task card components
│   ├── lists/          # Task list components
│   ├── timer/          # Timer-related components
│   └── actions/        # Action button components
├── containers/         # Container components
├── hooks/             # Feature-specific hooks
│   ├── mutations/     # Mutation hooks
│   └── __tests__/     # Hook tests
├── forms/             # Form components
├── types/             # TypeScript types
├── utils/             # Feature utilities
└── index.ts           # Feature exports
```

## Component Categories

### 1. UI Components (`src/components/ui/`)

Reusable, design-system components based on shadcn/ui.

#### Button Components
```typescript
// Location: src/components/ui/button/
import { Button } from '@/components/ui/button';

// Usage
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

#### Form Components
```typescript
// Location: src/components/ui/form/
import { Input, Label } from '@/components/ui/form';

// Usage
<div>
  <Label htmlFor="title">Task Title</Label>
  <Input id="title" name="title" required />
</div>
```

#### Loading Components
```typescript
// Location: src/components/ui/loading/
import { LoadingSpinner, PageLoader } from '@/components/ui/loading/UnifiedLoadingStates';

// Usage
<LoadingSpinner size="md" />
<PageLoader message="Loading tasks..." />
```

### 2. Layout Components (`src/components/layout/`)

Components that handle page layout and navigation.

```typescript
// Location: src/components/layout/
import { SimpleNavbar } from '@/components/layout/simple-navbar';
```

### 3. Form Components (`src/components/form/`)

Specialized form components with complex functionality.

```typescript
// Location: src/components/form/
import { QuickActionBar } from '@/components/form/QuickActionBar';
```

### 4. Feature Components (`src/features/*/components/`)

Feature-specific components that encapsulate business logic.

## TypeScript Patterns

### Props Interfaces
All component props must use interfaces with `Props` suffix:

```typescript
interface TaskCardProps {
  task: Task;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  className?: string;
}

export function TaskCard({ task, onEdit, onDelete, className }: TaskCardProps) {
  // Component implementation
}
```

### Component Typing
Use explicit component typing for better TypeScript support:

```typescript
import type { FC, ReactNode } from 'react';

interface WrapperComponentProps {
  children: ReactNode;
  className?: string;
}

export const WrapperComponent: FC<WrapperComponentProps> = ({ 
  children, 
  className 
}) => {
  return <div className={className}>{children}</div>;
};
```

## Performance Patterns

### Lazy Loading
Components that are not critical for initial load should be lazy-loaded:

```typescript
import { lazy, Suspense } from 'react';
import { PageLoader } from '@/components/ui/loading/UnifiedLoadingStates';

// Lazy load heavy components
const TaskActions = lazy(() => import('@/features/tasks/components/actions/TaskActions'));

export function TaskDetailsView() {
  return (
    <div>
      {/* Critical content */}
      
      <Suspense fallback={<PageLoader message="Loading actions..." />}>
        <TaskActions />
      </Suspense>
    </div>
  );
}
```

### Memoization
Use React.memo for components that re-render frequently:

```typescript
import { memo } from 'react';

interface TaskCardProps {
  task: Task;
  // ... other props
}

export const TaskCard = memo(function TaskCard({ task }: TaskCardProps) {
  // Component implementation
});
```

### Callback Optimization
Use useCallback for event handlers passed to memoized components:

```typescript
import { useCallback } from 'react';

export function TaskList({ tasks }: { tasks: Task[] }) {
  const handleTaskEdit = useCallback((taskId: string) => {
    // Edit logic
  }, []);

  return (
    <div>
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onEdit={handleTaskEdit}
        />
      ))}
    </div>
  );
}
```

## Accessibility Guidelines

### Semantic HTML
Use proper semantic HTML elements:

```typescript
export function TaskCard({ task }: TaskCardProps) {
  return (
    <article role="article" aria-labelledby={`task-${task.id}-title`}>
      <h3 id={`task-${task.id}-title`}>{task.title}</h3>
      <p>{task.description}</p>
      
      <button 
        aria-label={`Edit task: ${task.title}`}
        onClick={() => onEdit(task.id)}
      >
        Edit
      </button>
    </article>
  );
}
```

### ARIA Attributes
Include proper ARIA attributes for screen readers:

```typescript
export function TaskList({ tasks, isLoading }: TaskListProps) {
  return (
    <div role="region" aria-label="Task list">
      {isLoading && (
        <div role="status" aria-live="polite">
          Loading tasks...
        </div>
      )}
      
      <ul role="list">
        {tasks.map(task => (
          <li key={task.id} role="listitem">
            <TaskCard task={task} />
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Error Handling Patterns

### Error Boundaries
Use error boundaries for graceful error handling:

```typescript
import { UnifiedErrorBoundary } from '@/components/ui/UnifiedErrorBoundary';

export function FeatureWrapper({ children }: { children: ReactNode }) {
  return (
    <UnifiedErrorBoundary 
      variant="component" 
      title="Task Feature Error"
    >
      {children}
    </UnifiedErrorBoundary>
  );
}
```

### Error State Handling
Components should handle error states gracefully:

```typescript
export function TaskCard({ task, error }: TaskCardProps) {
  if (error) {
    return (
      <div className="error-state" role="alert">
        <p>Failed to load task: {error.message}</p>
        <button onClick={onRetry}>Retry</button>
      </div>
    );
  }

  return (
    // Normal task card
  );
}
```

## Testing Patterns

### Component Testing
Use standardized testing patterns:

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { createTestData } from '@/lib/testing/standardized-patterns';

import { TaskCard } from './TaskCard';

describe('TaskCard', () => {
  it('should render task information', () => {
    const task = createTestData.task({
      title: 'Test Task',
      description: 'Test Description'
    });

    render(<TaskCard task={task} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should be accessible', () => {
    const task = createTestData.task();
    render(<TaskCard task={task} onEdit={vi.fn()} onDelete={vi.fn()} />);

    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-labelledby');
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    expect(editButton).toHaveAttribute('aria-label');
  });
});
```

## Styling Patterns

### Tailwind CSS Usage
Use Tailwind utilities following the established patterns:

```typescript
export function TaskCard({ task, className }: TaskCardProps) {
  return (
    <div className={cn(
      // Base styles
      'rounded-lg border bg-card p-4 shadow-sm',
      // State styles
      'hover:shadow-md transition-shadow duration-200',
      // Responsive styles
      'sm:p-6',
      // Custom classes
      className
    )}>
      {/* Content */}
    </div>
  );
}
```

### CSS Custom Properties
For theme-dependent styling, use CSS custom properties:

```typescript
export function ThemedComponent() {
  return (
    <div 
      className="bg-background text-foreground"
      style={{
        '--custom-spacing': 'var(--spacing-4)',
        padding: 'var(--custom-spacing)'
      }}
    >
      Content
    </div>
  );
}
```

## File Naming Conventions

### Component Files
- **PascalCase**: `TaskCard.tsx`, `UserProfile.tsx`
- **Co-location**: Keep related files together
- **Index Files**: Use for barrel exports

### Test Files
- **Pattern**: `ComponentName.test.tsx`
- **Location**: Next to component or in `__tests__/` folder

### Type Files
- **Pattern**: `types.ts` or `ComponentName.types.ts`
- **Location**: Feature-level or component-level

## Development Workflow

### Creating New Components

1. **Determine Category**: UI, Layout, Form, or Feature component
2. **Choose Location**: Based on component category and usage
3. **Create Files**: Component, types (if complex), tests
4. **Follow Patterns**: Use established patterns for props, styling, accessibility
5. **Add Documentation**: Include JSDoc comments for complex components

### Component Review Checklist

- [ ] Follows established naming conventions
- [ ] Uses proper TypeScript typing with `Props` suffix
- [ ] Includes accessibility attributes
- [ ] Handles loading and error states
- [ ] Has comprehensive tests
- [ ] Uses performance optimization (memo, lazy loading) when needed
- [ ] Follows Tailwind CSS patterns
- [ ] Includes proper documentation

## Future Considerations

### Component Library Evolution
- Consider extracting common components to shared library
- Implement component playground/Storybook for documentation
- Add automated visual regression testing

### Performance Monitoring
- Monitor component render performance
- Track bundle size impact of new components  
- Implement component-level performance budgets

### Accessibility Improvements
- Add automated accessibility testing
- Implement high contrast mode support
- Add keyboard navigation testing

This documentation should be updated as component patterns evolve and new best practices emerge. 