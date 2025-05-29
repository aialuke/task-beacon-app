# Component Patterns and Structure

This document outlines the component organization and structural patterns used in the codebase.

## Component Categories

### 1. UI Components (`components/ui/`)

Base Shadcn UI components that provide foundational design system elements.

### 2. Layout Components (`components/ui/layout/`)

Layout-specific UI components for structural elements.

### 3. Business Components (`components/business/`)

Shared business logic components that can be reused across features.

### 4. Feature Components (`features/*/components/`)

Feature-specific components that encapsulate domain logic.

## Functional Component Pattern

```tsx
// Import statements (standardized order)
import { memo, useCallback } from 'react';
import { ComponentProps } from './types';
import { Button } from '@/components/ui/button';
import { useFeatureHook } from '@/features/feature/hooks/useFeatureHook';

// Component definition
function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Hooks (in order: context, queries, mutations, state, effects)
  const { data } = useFeatureHook();

  // Derived state
  const computedValue = useMemo(() => data?.value, [data]);

  // Event handlers
  const handleClick = useCallback(() => {
    // Handler logic
  }, []);

  // Render
  return <div>{/* Component JSX */}</div>;
}

// Export with memo for performance optimization when appropriate
export default memo(ComponentName);
```

## Component Size Guidelines

- **Target**: 50 lines of code or less per component
- **Maximum**: 100 lines before considering refactoring
- **Refactoring**: Extract sub-components when approaching limits

## Performance Optimization

- **React.memo()**: For components that receive stable props
- **useMemo()**: For expensive calculations
- **useCallback()**: For event handlers and functions passed as props
- **Code splitting**: Lazy loading for routes and large components
