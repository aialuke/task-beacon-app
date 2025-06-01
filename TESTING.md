# Testing Strategy - Task Beacon App

This document outlines our comprehensive testing strategy for the Task Beacon application, covering unit tests, integration tests, component tests, and end-to-end testing.

## 🎯 Testing Philosophy

Our testing approach follows the **Testing Pyramid** principle:
- **Unit Tests (70%)**: Fast, isolated tests for individual functions and hooks
- **Integration Tests (20%)**: Tests for feature workflows and API interactions  
- **E2E Tests (10%)**: End-to-end user journey tests

## 🏗️ Test Architecture

### Test Categories

#### 1. Unit Tests
**Purpose**: Test individual functions, utilities, and hooks in isolation
**Location**: `**/*.test.ts` files alongside source code
**Coverage Target**: 90%+

**Examples**:
- Pure functions (utilities, validation, formatting)
- Custom hooks (useTaskMutations, useRealtimeSubscription)
- Business logic functions
- Error handling utilities

```typescript
// Example: src/lib/utils/date.test.ts
import { formatDueDate, getDaysRemaining } from './date';

describe('date utilities', () => {
  it('should format due date correctly', () => {
    const date = '2024-12-25T00:00:00Z';
    expect(formatDueDate(date)).toBe('Dec 25, 2024');
  });
});
```

#### 2. Component Tests
**Purpose**: Test React component behavior, accessibility, and user interactions
**Location**: `**/__tests__/**` directories
**Coverage Target**: 85%+

**Examples**:
- UI component rendering and props
- User interaction handling
- Accessibility compliance
- Responsive behavior

```typescript
// Example: src/components/ui/__tests__/SimpleNavbar.test.tsx
import { render, fireEvent } from '@testing-library/react';
import { SimpleNavbar } from '../SimpleNavbar';

describe('SimpleNavbar', () => {
  it('should handle keyboard navigation', () => {
    const { getByRole } = render(<SimpleNavbar {...props} />);
    const navbar = getByRole('tablist');
    
    fireEvent.keyDown(navbar, { key: 'ArrowRight' });
    expect(onItemChange).toHaveBeenCalledWith('next-item');
  });
});
```

#### 3. Integration Tests
**Purpose**: Test feature workflows and API interactions
**Location**: `src/features/**/tests/` directories
**Coverage Target**: 80%+

**Examples**:
- Task CRUD operations
- Real-time subscription workflows
- User authentication flows
- Error handling scenarios

```typescript
// Example: src/features/tasks/tests/taskWorkflow.test.ts
import { renderHook } from '@testing-library/react-hooks';
import { useTaskMutations } from '../hooks/useTaskMutations';

describe('Task Workflow Integration', () => {
  it('should complete full task lifecycle', async () => {
    // Test create -> update -> delete workflow
  });
});
```

#### 4. E2E Tests (Planned)
**Purpose**: Test complete user journeys
**Tool**: Playwright or Cypress
**Coverage Target**: Critical user paths

**Examples**:
- User registration and login
- Create task and track completion
- Real-time collaboration scenarios

## 🛠️ Testing Tools & Setup

### Core Testing Stack
- **Test Runner**: Vitest (fast, Vite-compatible)
- **Component Testing**: React Testing Library
- **Mocking**: Vitest mocks and MSW (Mock Service Worker)
- **Assertions**: Vitest expect (Jest-compatible)

### Test Utilities
**Location**: `src/test/testUtils.ts`

**Key Utilities**:
- `renderWithProviders()`: Render components with all necessary providers
- `createMockUser()` / `createMockTask()`: Factory functions for test data
- `mockApiResponses`: Standardized API response mocks
- `mockTimers()`: Time-based testing utilities

```typescript
// Example usage of test utilities
import { renderWithProviders, createMockTask } from '@/test/testUtils';

test('renders task card correctly', () => {
  const task = createMockTask({ title: 'Test Task' });
  const { getByText } = renderWithProviders(<TaskCard task={task} />);
  
  expect(getByText('Test Task')).toBeInTheDocument();
});
```

## 📊 Test Coverage Goals

### Coverage Targets by File Type

| File Type | Target Coverage | Priority |
|-----------|----------------|----------|
| Utilities (`src/lib/utils/`) | 95% | High |
| Hooks (`src/hooks/`) | 90% | High |
| Components (`src/components/`) | 85% | High |
| API Layer (`src/integrations/`) | 90% | High |
| Pages (`src/pages/`) | 70% | Medium |
| Types (`src/types/`) | N/A | - |

### Critical Coverage Areas
1. **Error Handling**: All error scenarios must be tested
2. **Authentication**: All auth flows and edge cases
3. **Data Mutations**: All CRUD operations
4. **Real-time Features**: Subscription management and cleanup
5. **Accessibility**: ARIA attributes and keyboard navigation

## 🧪 Testing Patterns

### 1. Hook Testing Pattern
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClientProvider } from '@tanstack/react-query';
import { createTestQueryClient } from '@/test/testUtils';

describe('useTaskMutations', () => {
  let queryClient;
  
  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  it('should handle optimistic updates', async () => {
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useTaskMutations(), { wrapper });
    
    await act(async () => {
      await result.current.toggleTaskComplete(mockTask);
    });

    expect(result.current.isLoading).toBe(false);
  });
});
```

### 2. Component Testing Pattern
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/test/testUtils';

describe('TaskCard Component', () => {
  it('should expand on click', () => {
    const { getByTestId } = renderWithProviders(
      <TaskCard task={mockTask} />
    );

    const card = getByTestId('task-card');
    fireEvent.click(card);

    expect(card).toHaveClass('expanded');
  });

  it('should be accessible', () => {
    const { getByRole } = renderWithProviders(
      <TaskCard task={mockTask} />
    );

    const card = getByRole('article');
    expect(card).toHaveAttribute('aria-label');
    expect(card).toHaveAttribute('tabIndex', '0');
  });
});
```

### 3. API Testing Pattern
```typescript
import { vi } from 'vitest';
import * as tasksApi from '@/integrations/supabase/api/tasks.api';
import { mockApiResponses } from '@/test/testUtils';

describe('Tasks API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(tasksApi.getTasks).mockRejectedValue(
      new Error('Network error')
    );

    const result = await tasksApi.getTasks();
    expect(result.error).toBeDefined();
    expect(result.data).toBeNull();
  });
});
```

## 🚨 Testing Best Practices

### Do's ✅
- **Test behavior, not implementation**: Focus on what the component does, not how
- **Use meaningful test names**: Describe the scenario and expected outcome
- **Arrange-Act-Assert pattern**: Structure tests clearly
- **Mock external dependencies**: Keep tests isolated and fast
- **Test accessibility**: Verify ARIA attributes and keyboard navigation
- **Test error states**: Ensure graceful error handling

### Don'ts ❌
- **Don't test implementation details**: Avoid testing internal component state
- **Don't write brittle tests**: Avoid relying on exact text or styling
- **Don't ignore async operations**: Always wait for async operations to complete
- **Don't skip cleanup**: Clean up mocks and test state between tests
- **Don't test third-party libraries**: Focus on your own code

### Accessibility Testing
```typescript
import { expectAccessibilityAttributes } from '@/test/testUtils';

it('should have proper accessibility attributes', () => {
  const { getByRole } = render(<Button variant="primary">Click me</Button>);
  const button = getByRole('button');

  expectAccessibilityAttributes(button, {
    'aria-label': 'Click me',
    'tabIndex': '0',
    'role': 'button'
  });
});
```

## 🔄 Continuous Integration

### Pre-commit Hooks
- Lint all code
- Run affected tests
- Type checking
- Format code

### CI Pipeline
1. **Install dependencies**
2. **Lint and type check**
3. **Run all tests with coverage**
4. **Build application**
5. **Deploy if tests pass**

### Coverage Reports
- Generate coverage reports on CI
- Fail build if coverage drops below thresholds
- Upload coverage to tracking service (e.g., Codecov)

## 📝 Test Documentation Standards

### Test File Naming
- Unit tests: `filename.test.ts`
- Component tests: `ComponentName.test.tsx`
- Integration tests: `featureName.integration.test.ts`

### Test Structure
```typescript
describe('Feature/Component Name', () => {
  // Setup and teardown
  beforeEach(() => {
    // Common setup
  });

  afterEach(() => {
    // Cleanup
  });

  describe('specific functionality', () => {
    it('should do something when condition is met', () => {
      // Arrange
      const input = 'test data';
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe('expected output');
    });
  });

  describe('error handling', () => {
    it('should handle invalid input gracefully', () => {
      // Error scenario tests
    });
  });

  describe('accessibility', () => {
    it('should be keyboard navigable', () => {
      // Accessibility tests
    });
  });
});
```

## 🎯 Testing Checklist

### For New Features
- [ ] Unit tests for all new functions/hooks
- [ ] Component tests for UI components
- [ ] Integration tests for feature workflows
- [ ] Accessibility tests for interactive elements
- [ ] Error handling tests for all failure scenarios
- [ ] Performance tests for critical paths
- [ ] Documentation updated with examples

### For Bug Fixes
- [ ] Reproduce bug with failing test
- [ ] Fix implementation
- [ ] Verify test passes
- [ ] Add regression test
- [ ] Update related tests if needed

## 🚀 Running Tests

### Available Commands (to be added)
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test TaskCard.test.tsx

# Run tests for changed files only
npm run test:changed
```

### Test Configuration
Tests are configured in `vitest.config.ts` with:
- Test environment: jsdom (for DOM APIs)
- Coverage provider: v8
- Setup files: `src/test/setup.ts`
- Mock handling for modules and assets

## 📚 Additional Resources

- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro)
- [Vitest Documentation](https://vitest.dev/)
- [Accessibility Testing Guide](https://web.dev/accessibility-testing/)
- [MSW (Mock Service Worker)](https://mswjs.io/)

---

**Remember**: Good tests are an investment in code quality, developer confidence, and user experience. They should be maintained with the same care as production code. 