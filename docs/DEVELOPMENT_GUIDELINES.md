
# Development Guidelines

This document outlines the development standards, best practices, and workflows for the Task Management Application.

## Table of Contents

- [Getting Started](#getting-started)
- [Code Standards](#code-standards)
- [Component Development](#component-development)
- [TypeScript Guidelines](#typescript-guidelines)
- [State Management](#state-management)
- [Testing Guidelines](#testing-guidelines)
- [Git Workflow](#git-workflow)
- [Performance Guidelines](#performance-guidelines)
- [Security Guidelines](#security-guidelines)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or bun package manager
- Git
- VSCode (recommended) with recommended extensions

### Development Setup
```bash
# Clone the repository
git clone <repository-url>
cd task-beacon-app

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev

# Run tests
npm run test
# or
bun test
```

### Recommended VSCode Extensions
- TypeScript Importer
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Auto Rename Tag
- Thunder Client (for API testing)

## Code Standards

### Formatting and Linting
- Use **Prettier** for code formatting
- Use **ESLint** for code linting
- Configuration is enforced via pre-commit hooks
- Run `npm run lint:fix` to fix auto-fixable issues

### Import Organization
```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';

// 2. Internal UI components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// 3. Internal business components
import { TaskCard } from '@/components/business/TaskCard';

// 4. Feature-specific imports
import { useTaskMutations } from '@/features/tasks/hooks/useTaskMutations';

// 5. Types (grouped at end)
import type { Task, TaskStatus } from '@/types';
```

### Naming Conventions

#### Files and Directories
```
// React Components (PascalCase)
TaskCard.tsx
UserProfile.tsx

// Hooks (camelCase with 'use' prefix)
useTaskMutations.ts
useFormValidation.ts

// Utilities (camelCase)
dateUtils.ts
validationUtils.ts

// Types (camelCase)
task.types.ts
user.types.ts

// Constants (SCREAMING_SNAKE_CASE)
API_ENDPOINTS.ts
VALIDATION_RULES.ts
```

#### Variables and Functions
```typescript
// Variables: camelCase
const taskList = [];
const isLoading = false;

// Functions: camelCase with descriptive verbs
const validateUserInput = () => {};
const formatTaskTitle = () => {};

// Constants: SCREAMING_SNAKE_CASE
const MAX_TITLE_LENGTH = 100;
const DEFAULT_PAGE_SIZE = 20;

// Component props: camelCase
interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  isSelected: boolean;
}
```

#### TypeScript Types
```typescript
// Interfaces: PascalCase with descriptive names
interface TaskFormData {
  title: string;
  description: string;
}

// Types: PascalCase
type TaskStatus = 'pending' | 'complete' | 'overdue';

// Enums: PascalCase (prefer const objects)
const TaskPriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;
```

## Component Development

### Component Structure
```typescript
/**
 * TaskCard Component
 * 
 * Displays a task with actions and metadata. Supports optimistic updates
 * for better user experience.
 * 
 * @param task - The task data to display
 * @param onComplete - Callback when task is marked complete
 * @param className - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <TaskCard 
 *   task={task} 
 *   onComplete={handleComplete}
 *   className="mb-4"
 * />
 * ```
 */
import { memo, useCallback } from 'react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { useTaskMutations } from '@/features/tasks/hooks/useTaskMutations';

interface TaskCardProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  className?: string;
  'data-testid'?: string;
}

export const TaskCard = memo(function TaskCard({
  task,
  onComplete,
  className,
  'data-testid': testId,
}: TaskCardProps) {
  // Hooks (in order: context, queries, mutations, state, effects)
  const { toggleTaskComplete } = useTaskMutations();

  // Derived state
  const isCompleted = task.status === 'complete';

  // Event handlers (use useCallback for functions passed as props)
  const handleComplete = useCallback(async () => {
    await toggleTaskComplete(task);
    onComplete?.(task.id);
  }, [task, toggleTaskComplete, onComplete]);

  // Early returns for loading/error states
  if (!task) {
    return <div>No task data</div>;
  }

  // Main render
  return (
    <div className={cn('task-card', className)} data-testid={testId}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <Button onClick={handleComplete} disabled={isCompleted}>
        {isCompleted ? 'Completed' : 'Mark Complete'}
      </Button>
    </div>
  );
});
```

### Component Guidelines

1. **Use TypeScript**: All components must have proper TypeScript interfaces
2. **Use memo()**: Wrap components in `memo()` when they receive props that change frequently
3. **Props Interface**: Always define a clear props interface
4. **Documentation**: Add JSDoc comments for complex components
5. **Error Boundaries**: Components should handle their own error states
6. **Accessibility**: Include proper ARIA labels and semantic HTML
7. **Testing**: Include `data-testid` props for testing

### Hook Development
```typescript
/**
 * Custom hook for managing task mutations with optimistic updates
 * 
 * @returns Object containing mutation functions for task operations
 * 
 * @example
 * ```typescript
 * const { toggleTaskComplete, deleteTask } = useTaskMutations();
 * await toggleTaskComplete(task);
 * ```
 */
export function useTaskMutations() {
  const queryClient = useQueryClient();

  const toggleTaskComplete = useCallback(async (task: Task) => {
    // Implementation with error handling
    try {
      const result = await TaskService.updateStatus(task.id, 'complete');
      if (!result.success) {
        throw new Error(result.error?.message);
      }
      return result;
    } catch (error) {
      // Proper error handling
      console.error('Failed to toggle task:', error);
      throw error;
    }
  }, []);

  return useMemo(() => ({
    toggleTaskComplete,
    // Other mutations...
  }), [toggleTaskComplete]);
}
```

## TypeScript Guidelines

### Type Definitions
```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// Use types for unions, primitives, and computed types
type Status = 'loading' | 'success' | 'error';
type UserKeys = keyof User;

// Use generic constraints
interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// Use utility types
type PartialUser = Partial<User>;
type RequiredEmail = Required<Pick<User, 'email'>>;
```

### Type Organization
- Feature-specific types go in `features/*/types/`
- Shared types go in `types/shared/`
- Utility types go in `types/utility/`
- API types go in `types/api/`

### Strict TypeScript
- Use strict mode (`"strict": true`)
- Avoid `any` - use `unknown` when type is truly unknown
- Use type assertions sparingly and with type guards
- Prefer type narrowing over type assertions

## State Management

**📋 See [State Management Guidelines](./STATE_MANAGEMENT_GUIDELINES.md) for comprehensive patterns and best practices.**

### Quick Reference

- **Server State**: Use TanStack Query (React Query)
- **Global Client State**: Use React Context with standardized patterns
- **Feature-Specific State**: Use feature-scoped Context providers
- **Component State**: Use useState/useReducer for local state

### Decision Matrix

| State Type | Tool | Example |
|------------|------|---------|
| Server Data | React Query | Tasks, Users, API responses |
| Auth State | React Context + React Query | User session |
| UI Preferences | React Context | Theme, Language |
| Feature UI State | React Context | Task filters, expanded states |
| Component State | useState/useReducer | Form inputs, modal state |

## Testing Guidelines

### Test Structure
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { TaskCard } from './TaskCard';

// Mock external dependencies
vi.mock('@/features/tasks/hooks/useTaskMutations');

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders task information correctly', () => {
    render(<TaskCard task={mockTask} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onComplete when complete button is clicked', async () => {
    const mockOnComplete = vi.fn();
    
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);
    
    fireEvent.click(screen.getByText('Mark Complete'));
    
    expect(mockOnComplete).toHaveBeenCalledWith('1');
  });
});
```

### Testing Best Practices
1. **Test behavior, not implementation**
2. **Use descriptive test names**
3. **Mock external dependencies**
4. **Test error cases**
5. **Use data-testid for complex queries**
6. **Keep tests focused and independent**

## Git Workflow

### Branch Naming
```
feature/task-completion-optimization
fix/memory-leak-in-task-list
docs/update-component-guidelines
refactor/type-system-organization
```

### Commit Messages
```
feat: add optimistic updates to task completion
fix: resolve memory leak in task list rendering
docs: update component development guidelines
refactor: reorganize type system for better maintainability
test: add comprehensive tests for task mutations
chore: update dependencies and configure tooling
```

### Pull Request Process
1. **Create feature branch** from `main`
2. **Make atomic commits** with clear messages
3. **Write/update tests** for changes
4. **Update documentation** if needed
5. **Run linting and tests** locally
6. **Create PR** with clear description
7. **Request review** from team member
8. **Address feedback** and update PR
9. **Merge** using "Squash and merge"

## Performance Guidelines

### Component Optimization
```typescript
// Use memo for expensive components
const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  // Component implementation
});

// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Use useCallback for event handlers
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);
```

### Bundle Optimization
- Use dynamic imports for route-based code splitting
- Lazy load heavy components and libraries
- Optimize images and assets
- Monitor bundle size with build tools

### Runtime Performance
- Minimize re-renders with proper memoization
- Use React DevTools Profiler to identify bottlenecks
- Implement virtualization for large lists
- Optimize API calls with proper caching

## Security Guidelines

### Data Handling
```typescript
// ✅ Validate user input
const validateTaskTitle = (title: string): boolean => {
  return title.length > 0 && title.length <= 100;
};

// ✅ Sanitize data before displaying
const SafeTaskDescription = ({ description }: { description: string }) => (
  <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }} />
);

// ❌ Never trust user input
const UnsafeComponent = ({ userContent }: { userContent: string }) => (
  <div dangerouslySetInnerHTML={{ __html: userContent }} /> // BAD
);
```

### Authentication & Authorization
- Use Supabase Row Level Security (RLS)
- Validate permissions on both client and server
- Store sensitive data in secure HTTP-only cookies
- Implement proper session management

### Environment Variables
```typescript
// ✅ Use environment variables for configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// ❌ Never commit secrets to version control
const apiKey = 'sk-1234567890abcdef'; // BAD
```

### Dependencies
- Regularly update dependencies
- Use `npm audit` to check for vulnerabilities
- Review new dependencies before adding
- Pin dependency versions in production

## Code Review Checklist

### Functionality
- [ ] Does the code solve the intended problem?
- [ ] Are edge cases handled properly?
- [ ] Are error cases handled gracefully?

### Code Quality
- [ ] Is the code readable and well-organized?
- [ ] Are naming conventions followed?
- [ ] Is the code properly typed with TypeScript?
- [ ] Are there any code smells or anti-patterns?

### State Management
- [ ] Is the appropriate state management tool used?
- [ ] Are server state and client state properly separated?
- [ ] Is the context hierarchy logical and efficient?
- [ ] Are queries and mutations properly structured?

### Performance
- [ ] Are there any obvious performance issues?
- [ ] Is memoization used appropriately?
- [ ] Are expensive operations optimized?

### Testing
- [ ] Are there adequate tests for new functionality?
- [ ] Do tests cover edge cases and error scenarios?
- [ ] Are tests clear and maintainable?

### Documentation
- [ ] Is complex logic documented?
- [ ] Are public APIs documented?
- [ ] Is the README updated if needed?

## Resources

- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Testing Library Documentation](https://testing-library.com/)
- [TanStack Query Guide](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [State Management Guidelines](./STATE_MANAGEMENT_GUIDELINES.md)
