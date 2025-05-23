
# Code Patterns and Conventions

This document outlines the patterns and conventions used in the codebase to maintain consistency and improve maintainability.

## Naming Conventions

- **Components**: PascalCase (e.g., `TaskCard`, `CreateTaskForm`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTaskContext`, `useCreateTask`)
- **Utility functions**: camelCase (e.g., `formatDate`, `truncateUrl`)
- **Constants**: UPPER_SNAKE_CASE for global constants, camelCase for component-level constants
- **Files**:
  - React components: PascalCase (e.g., `TaskCard.tsx`)
  - Hooks: camelCase (e.g., `useTaskContext.ts`)
  - Utility files: camelCase (e.g., `dateUtils.ts`)
  - Context files: PascalCase with `Context` suffix (e.g., `TaskContext.tsx`)

## Component Structure

### Functional Components

```tsx
// Import statements
import { memo } from "react";
import { ComponentProps } from "./types";

// Component definition
function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Hooks
  
  // Derived state
  
  // Event handlers
  
  // Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}

// Export with memo for performance optimization when appropriate
export default memo(ComponentName);
```

## Custom Hooks Pattern

Custom hooks encapsulate complex logic and are named with the `use` prefix:

```tsx
export function useCustomHook() {
  // State
  
  // Effects
  
  // Helper functions
  
  // Return values and handlers
  return {
    value1,
    value2,
    handleEvent,
  };
}
```

## API Layer Pattern

API functions follow this pattern:

```ts
export const apiFunction = async (param1, param2): Promise<TablesResponse<ReturnType>> => {
  // Mock data handling for development
  if (isMockingSupabase) {
    return mockResponse;
  }

  // Actual API call wrapped in error handling
  return apiRequest(async () => {
    const { data, error } = await supabase
      .from("table")
      .select()
      .eq("condition", value);
      
    if (error) throw error;
    return data;
  });
};
```

## Error Handling

Errors are handled at three levels:

1. **API Layer**: Standardized error format with `handleApiError` utility
2. **Hooks Layer**: Try/catch blocks that use toast notifications
3. **UI Layer**: Fallback UI components and error states

## State Management

- Use **local state** (useState) for component-specific state
- Use **context** for shared state across components
- Use **TanStack Query** for server state and data fetching

## Performance Optimization

- Memoize components with `React.memo()` when appropriate
- Memoize expensive calculations with `useMemo()`
- Memoize callback functions with `useCallback()`
- Use `useFilteredTasks` and similar hooks to avoid recalculation

## Form Handling

Forms use a two-layer approach:

1. Base hooks for common form functionality (`useBaseTaskForm`)
2. Specialized hooks for specific forms (`useCreateTask`, `useFollowUpTask`)

## Animation Patterns

Animations use React Spring with these principles:

1. Animate CSS properties that trigger only compositing (`transform`, `opacity`)
2. Use `will-change` property for performance optimization
3. Respect user preferences with `prefers-reduced-motion` media query

## Testing Conventions

- **Unit tests**: One test file per utility file
- **Component tests**: Focus on user interactions and outcomes
- **Mocks**: Use mocks for external dependencies (Supabase, etc.)
- **Test IDs**: Use data-testid attributes for component testing

## Import Order

1. React and React-related imports
2. Third-party libraries
3. Internal components
4. Internal hooks
5. Internal utilities
6. Types and interfaces
7. Assets and styles
