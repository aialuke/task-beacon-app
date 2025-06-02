# ADR-0003: TypeScript Type Organization

## Status
**Accepted** (December 2024)

## Context

As the application grew, TypeScript type definitions became scattered throughout the codebase, leading to:
- Duplicate type definitions
- Inconsistent naming conventions
- Difficulty finding and reusing types
- Circular dependency issues
- Poor IntelliSense experience
- Unclear relationships between types

We needed a systematic approach to organize types that would:
- Eliminate duplication
- Create clear hierarchies and relationships
- Support feature-based development
- Enable better tooling and developer experience
- Scale with application growth

## Decision

We implemented a **hierarchical type organization system** with clear separation between shared, feature-specific, and utility types.

## Type Organization Structure

```
src/types/
├── shared/                     # Cross-cutting types used throughout app
│   ├── api.types.ts           # API response patterns and errors
│   ├── auth.types.ts          # Authentication and authorization
│   ├── common.types.ts        # Basic utilities and patterns
│   ├── database.types.ts      # Database operations and schemas
│   └── ui.types.ts            # UI components and patterns
├── feature-types/             # Domain-specific business types
│   ├── task.types.ts          # Task management domain
│   └── user.types.ts          # User management domain
├── utility/                   # Advanced TypeScript utilities
│   └── helpers.types.ts       # Type manipulation helpers
└── index.ts                   # Main export barrel
```

## Alternatives Considered

### 1. Single types.ts File
**Pros:**
- Simple to understand
- All types in one place

**Cons:**
- Becomes unwieldy with growth
- No logical organization
- Merge conflicts increase
- Poor IDE performance

### 2. Co-located Types (with components)
**Pros:**
- Types close to usage
- Feature encapsulation

**Cons:**
- Duplication across features
- Hard to share types
- Circular dependencies
- Inconsistent patterns

### 3. Domain-Driven Organization
**Pros:**
- Aligns with business domains
- Clear boundaries

**Cons:**
- Complex for cross-cutting concerns
- Over-engineering for our size
- Harder to find shared types

### 4. Technical Separation (components/, hooks/, etc.)
**Pros:**
- Matches code organization
- Familiar pattern

**Cons:**
- Breaks logical relationships
- Duplicate business concepts
- Poor reusability

## Consequences

### Positive
- **Clarity**: Clear distinction between shared and feature-specific types
- **Reusability**: Shared types eliminate duplication
- **Maintainability**: Changes to business types are centralized
- **Developer Experience**: Better IntelliSense and auto-completion
- **Scalability**: New features can easily extend the type system
- **Consistency**: Standardized patterns across the application

### Negative
- **Learning Curve**: Developers need to understand the organization system
- **Migration Effort**: Existing code needed to be refactored
- **Import Complexity**: Longer import paths for some types

## Implementation

### 1. Shared Types Structure

#### API Types (`shared/api.types.ts`)
```typescript
// Standardized API response patterns
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

export interface ApiError {
  message: string;
  name: string;
  code?: string;
  statusCode?: number;
}
```

#### Common Types (`shared/common.types.ts`)
```typescript
// Basic building blocks
export type ID = string;
export type Timestamp = string;

export interface BaseEntity {
  id: ID;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// Form patterns
export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}
```

### 2. Feature Types Structure

#### Task Types (`feature-types/task.types.ts`)
```typescript
import type { BaseEntity, ID, Timestamp } from '../shared/common.types';

export type TaskStatus = 'pending' | 'complete' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task extends BaseEntity {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority?: TaskPriority;
  due_date: Timestamp | null;
  // ... other task fields
}

export interface TaskCreateData {
  title: string;
  description?: string;
  due_date?: Timestamp;
  // ... creation fields
}
```

### 3. Utility Types (`utility/helpers.types.ts`)
```typescript
// Advanced TypeScript utilities
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// API and database helpers
export type TableInsert<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;
export type TableUpdate<T> = Partial<Omit<T, 'id' | 'created_at'>> & { updated_at?: string };
```

### 4. Import Patterns

```typescript
// Preferred: Direct imports from organized types
import type { Task, TaskStatus } from '@/types/feature-types/task.types';
import type { ApiResponse } from '@/types/shared/api.types';
import type { DeepPartial } from '@/types/utility/helpers.types';

// Acceptable: Barrel imports for commonly used types
import type { BaseEntity, ID, Timestamp } from '@/types/shared/common.types';

// Alternative: Main barrel import (when needed)
import type { Task, ApiResponse, BaseEntity } from '@/types';
```

### 5. Type Naming Conventions

- **Interfaces**: PascalCase with descriptive names (`TaskCreateData`, `UserProfile`)
- **Types**: PascalCase for unions and aliases (`TaskStatus`, `ApiResponse<T>`)
- **Generics**: Single uppercase letter or descriptive PascalCase (`T`, `TData`, `TResponse`)
- **Utility Types**: PascalCase with clear purpose (`DeepPartial<T>`, `KeysOfType<T, U>`)

### 6. Type Documentation Standards

```typescript
/**
 * Task - Core Task Entity
 * 
 * Represents a task in the task management system with all associated
 * metadata, relationships, and operational data.
 * 
 * @interface
 * @category Core Types
 * @since 1.0.0
 * 
 * @see {@link TaskStatus} - Available task statuses
 * @see {@link TaskCreateData} - Data for creating new tasks
 */
export interface Task extends BaseEntity {
  /** Task title (1-100 characters) */
  title: string;
  /** Detailed task description (optional, supports markdown) */
  description: string | null;
  // ... other documented fields
}
```

## Type Safety Guidelines

### 1. Strict TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### 2. Avoiding `any`
```typescript
// ❌ Bad: Using any
function processData(data: any): any {
  return data.someProperty;
}

// ✅ Good: Using unknown with type guards
function processData(data: unknown): string {
  if (isValidData(data)) {
    return data.someProperty;
  }
  throw new Error('Invalid data');
}

function isValidData(data: unknown): data is { someProperty: string } {
  return typeof data === 'object' && 
         data !== null && 
         'someProperty' in data &&
         typeof (data as any).someProperty === 'string';
}
```

### 3. Generic Constraints
```typescript
// Define clear constraints for generics
interface Repository<T extends BaseEntity> {
  findById(id: string): Promise<T>;
  create(data: TableInsert<T>): Promise<T>;
  update(id: string, data: TableUpdate<T>): Promise<T>;
}
```

## Benefits Realized

1. **Eliminated Type Duplication**: Single source of truth for each type
2. **Improved Developer Experience**: Better IntelliSense and auto-completion
3. **Faster Development**: Easy to find and reuse existing types
4. **Better Refactoring**: Type changes propagate correctly throughout codebase
5. **Consistent Patterns**: Standardized approach to type definitions
6. **Scalable Architecture**: New features integrate seamlessly

## Migration Strategy

1. **Phase 1**: Created new type organization structure
2. **Phase 2**: Migrated shared types to appropriate directories
3. **Phase 3**: Updated import statements throughout codebase
4. **Phase 4**: Migrated feature-specific types
5. **Phase 5**: Added utility types and documentation
6. **Phase 6**: Established linting rules and guidelines

## Notes

- Type organization aligns with feature-based architecture (ADR-0002)
- Supports React Query patterns from ADR-0001
- All types must be exported from appropriate barrel files
- Breaking changes to shared types require team review
- New types should follow established patterns and naming conventions

## References

- [TypeScript Handbook - Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Effective TypeScript](https://effectivetypescript.com/) 