# Naming Conventions

This document outlines the naming conventions used throughout the codebase.

## Components

- **Components**: PascalCase (e.g., `TaskCard`, `CreateTaskForm`)
- **Files**:
  - React components: PascalCase (e.g., `TaskCard.tsx`)
  - Context files: PascalCase with `Context` suffix (e.g., `TaskContext.tsx`)

## Hooks

- **Hooks**: camelCase with `use` prefix (e.g., `useTaskContext`, `useTaskMutations`)
- **Files**: camelCase (e.g., `useTaskMutations.ts`)

## Utilities and Functions

- **Utility functions**: camelCase (e.g., `formatDate`, `truncateUrl`)
- **Files**: camelCase (e.g., `dateUtils.ts`)

## Constants

- **Global constants**: UPPER_SNAKE_CASE
- **Component-level constants**: camelCase

## Examples

### Good Examples

```typescript
// Components
const TaskCard = () => { ... };
const CreateTaskForm = () => { ... };

// Hooks
const useTaskMutations = () => { ... };
const useTaskContext = () => { ... };

// Utilities
const formatDate = (date: Date) => { ... };
const truncateUrl = (url: string) => { ... };

// Constants
const API_BASE_URL = "https://api.example.com";
const defaultPageSize = 10;
```

### Avoid

```typescript
// Inconsistent casing
const taskcard = () => { ... }; // Should be TaskCard
const UseTaskMutations = () => { ... }; // Should be useTaskMutations
const Format_Date = (date: Date) => { ... }; // Should be formatDate
```
