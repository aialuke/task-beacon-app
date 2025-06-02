# ADR-0005: Testing Strategy

## Status
**Accepted** (December 2024)

## Context

The application needed a comprehensive testing strategy that would:
- Ensure code quality and reliability
- Support rapid development cycles
- Provide confidence for refactoring
- Scale with the growing codebase
- Support different types of testing (unit, integration, e2e)
- Integrate well with our React Query and feature-based architecture

We needed to choose appropriate testing tools, patterns, and strategies that would work well with our tech stack while providing good developer experience.

## Decision

We adopted **Vitest** as our primary testing framework with **React Testing Library** for component testing, emphasizing behavioral testing over implementation details.

## Testing Stack

- **Test Runner**: Vitest (faster, native ESM support)
- **Component Testing**: React Testing Library
- **Mocking**: Vitest's built-in mocking capabilities
- **Assertions**: Vitest's expect API (Jest-compatible)
- **Test Environment**: jsdom for DOM simulation
- **Coverage**: Vitest's built-in coverage with c8

## Alternatives Considered

### 1. Jest + React Testing Library
**Pros:**
- Industry standard with large ecosystem
- Extensive documentation and community
- Mature tooling and IDE support

**Cons:**
- Slower execution compared to Vitest
- Configuration complexity with ESM
- Heavier runtime overhead
- Less optimal for Vite-based projects

### 2. Testing Library + Cypress Component Testing
**Pros:**
- Real browser environment
- Visual debugging capabilities
- Component and e2e testing in one tool

**Cons:**
- Heavier setup and execution
- More complex CI/CD pipeline
- Slower feedback loop
- Overkill for unit testing

### 3. Vitest + Playwright
**Pros:**
- Fast unit tests with Vitest
- Powerful e2e testing with Playwright
- Good separation of concerns

**Cons:**
- Additional complexity
- Multiple testing frameworks to maintain
- Steeper learning curve

## Consequences

### Positive
- **Performance**: Vitest is significantly faster than Jest
- **Developer Experience**: Better integration with Vite and ESM
- **Simplicity**: Single testing framework for most use cases
- **Modern Features**: Native TypeScript support, watch mode, parallel execution
- **Compatibility**: Jest-compatible API for easy migration

### Negative
- **Ecosystem**: Smaller ecosystem compared to Jest
- **Learning Curve**: Team needs to learn Vitest-specific features
- **Tooling**: Some IDE extensions may be less mature

## Implementation

### 1. Testing Configuration

#### Vitest Configuration (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    pool: 'forks', // Memory optimization
    maxConcurrency: 1, // Prevent memory issues
    coverage: {
      provider: 'c8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
      ],
    },
  },
});
```

#### Test Setup (`src/test/setup.ts`)
```typescript
import '@testing-library/jest-dom';
import { beforeAll, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    })),
  },
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

### 2. Testing Patterns

#### Component Testing Pattern
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { TaskCard } from './TaskCard';
import type { Task } from '@/types';

// Test wrapper for providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

describe('TaskCard', () => {
  const mockTask: Task = {
    id: 'test-id',
    title: 'Test Task',
    description: 'Test Description',
    status: 'pending',
    // ... other required fields
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays task information correctly', () => {
    render(<TaskCard task={mockTask} />, { wrapper: TestWrapper });
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('handles task completion', async () => {
    const onComplete = vi.fn();
    
    render(
      <TaskCard task={mockTask} onComplete={onComplete} />, 
      { wrapper: TestWrapper }
    );
    
    fireEvent.click(screen.getByRole('button', { name: /complete/i }));
    
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledWith('test-id');
    });
  });
});
```

#### Hook Testing Pattern
```typescript
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { useTaskMutations } from './useTaskMutations';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useTaskMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('toggles task completion successfully', async () => {
    const { result } = renderHook(() => useTaskMutations(), {
      wrapper: createWrapper(),
    });

    let mutationResult;
    await act(async () => {
      mutationResult = await result.current.toggleTaskComplete(mockTask);
    });

    expect(mutationResult).toEqual({
      success: true,
      status: 'complete',
      task: mockTask,
    });
  });
});
```

#### Utility Testing Pattern
```typescript
import { describe, it, expect } from 'vitest';
import { formatTaskDueDate } from './dateUtils';

describe('formatTaskDueDate', () => {
  it('formats future dates correctly', () => {
    const futureDate = '2024-12-25T10:00:00Z';
    const result = formatTaskDueDate(futureDate);
    
    expect(result).toMatch(/Due in \d+ days?/);
  });

  it('handles null dates', () => {
    expect(formatTaskDueDate(null)).toBe('No due date');
  });

  it('throws error for invalid dates', () => {
    expect(() => formatTaskDueDate('invalid-date')).toThrow('Invalid date string');
  });
});
```

### 3. Testing Guidelines

#### What to Test
- **User Interactions**: Button clicks, form submissions, navigation
- **Data Display**: Content rendering, conditional display
- **State Changes**: Component state updates, prop changes
- **Error Handling**: Error states, fallback UI
- **Accessibility**: ARIA attributes, keyboard navigation

#### What Not to Test
- **Implementation Details**: Internal component state, private methods
- **Third-party Libraries**: React Query, Supabase functionality
- **Styles**: CSS classes, styling specifics
- **Constants**: Static data, configuration values

#### Testing Best Practices

1. **Test Behavior, Not Implementation**
```typescript
// ❌ Bad: Testing implementation details
expect(component.state.isLoading).toBe(true);

// ✅ Good: Testing user-visible behavior
expect(screen.getByText('Loading...')).toBeInTheDocument();
```

2. **Use Semantic Queries**
```typescript
// ❌ Bad: Using test IDs unnecessarily
screen.getByTestId('submit-button');

// ✅ Good: Using semantic queries
screen.getByRole('button', { name: /submit/i });
```

3. **Test Edge Cases**
```typescript
describe('TaskCard', () => {
  it('handles empty task title', () => {
    const taskWithEmptyTitle = { ...mockTask, title: '' };
    render(<TaskCard task={taskWithEmptyTitle} />);
    
    expect(screen.getByText('Untitled Task')).toBeInTheDocument();
  });

  it('handles missing due date', () => {
    const taskWithoutDueDate = { ...mockTask, due_date: null };
    render(<TaskCard task={taskWithoutDueDate} />);
    
    expect(screen.getByText('No due date')).toBeInTheDocument();
  });
});
```

### 4. Mocking Strategy

#### API Mocking
```typescript
// Mock service layer
vi.mock('@/lib/api/tasks.service', () => ({
  TaskService: {
    getMany: vi.fn(),
    updateStatus: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock specific responses
beforeEach(() => {
  vi.mocked(TaskService.getMany).mockResolvedValue({
    data: [mockTask],
    success: true,
    error: null,
  });
});
```

#### Context Mocking
```typescript
// Mock authentication context
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'test@example.com' },
    isAuthenticated: true,
    signOut: vi.fn(),
  }),
}));
```

### 5. Performance Testing

#### Memory Usage Optimization
```typescript
// vite.config.ts test configuration
export default defineConfig({
  test: {
    pool: 'forks', // Use forks instead of threads
    maxConcurrency: 1, // Limit concurrent tests
    isolate: true, // Isolate test environments
  },
});
```

#### Test Execution Speed
```bash
# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test TaskCard.test.tsx
```

## Testing Commands

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "test:run": "vitest run"
  }
}
```

## Coverage Targets

- **Statements**: 80% minimum
- **Branches**: 75% minimum  
- **Functions**: 80% minimum
- **Lines**: 80% minimum

Critical components (TaskCard, form components, hooks) should aim for 90%+ coverage.

## Integration with CI/CD

```yaml
# GitHub Actions example
- name: Run Tests
  run: npm run test:run

- name: Generate Coverage
  run: npm run test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/coverage-final.json
```

## Benefits Realized

1. **Fast Feedback**: Vitest provides rapid test execution
2. **Developer Experience**: Excellent watch mode and error reporting
3. **Type Safety**: Full TypeScript integration
4. **Maintainability**: Tests that focus on behavior remain stable during refactoring
5. **Confidence**: Comprehensive test coverage enables safe deployments

## Notes

- Tests should be co-located with components when feature-specific
- Shared test utilities go in `src/test/`
- Mock data should be realistic and comprehensive
- Tests serve as documentation for component behavior
- Regular review of test coverage to identify gaps

## References

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) 