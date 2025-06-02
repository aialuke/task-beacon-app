# ADR-0002: Feature-Based Architecture

## Status
**Accepted** (December 2024)

## Context

As the application grew in complexity, we needed to organize our codebase in a way that would:
- Scale with the addition of new features
- Make it easy for developers to locate related code
- Minimize dependencies between unrelated features
- Support independent development and testing of features
- Enable potential feature extraction or micro-frontend patterns in the future

Traditional folder-by-type organization (separating components, hooks, utils, etc.) was becoming unwieldy as features became more complex and interdependent.

## Decision

We adopted a **feature-based architecture** where code is organized by business domain/feature rather than by technical concern. Each feature encapsulates its own components, hooks, types, and business logic.

## Alternatives Considered

### 1. Folder-by-Type Architecture
```
src/
├── components/
├── hooks/
├── utils/
├── types/
└── services/
```

**Pros:**
- Familiar pattern
- Easy to understand at first
- Clear separation of technical concerns

**Cons:**
- Related code scattered across multiple directories
- Difficult to understand feature boundaries
- Hard to maintain as application grows
- Challenging to work on a single feature
- No encapsulation of feature logic

### 2. Domain-Driven Design (DDD)
```
src/
├── domains/
│   ├── user-management/
│   ├── task-management/
│   └── reporting/
```

**Pros:**
- Strong business domain focus
- Clear bounded contexts
- Good for complex business logic

**Cons:**
- May be overkill for our application size
- More complex mental model
- Requires deeper DDD knowledge

### 3. Atomic Design Pattern
```
src/
├── atoms/
├── molecules/
├── organisms/
├── templates/
└── pages/
```

**Pros:**
- Good for design system organization
- Clear hierarchy of complexity

**Cons:**
- Focused on UI hierarchy, not business logic
- Doesn't address business domain organization
- Can be confusing for business logic placement

## Consequences

### Positive
- **Improved Discoverability**: All code related to a feature is co-located
- **Better Encapsulation**: Features have clear boundaries and dependencies
- **Easier Testing**: Feature tests can be isolated and comprehensive
- **Team Productivity**: Developers can work on features independently
- **Maintainability**: Changes to a feature are contained within its directory
- **Future-Proof**: Supports potential micro-frontend extraction

### Negative
- **Learning Curve**: Team needed to adjust to new organization pattern
- **Shared Code Management**: Need clear guidelines for what goes in shared vs feature directories
- **Potential Duplication**: Risk of duplicating code across features instead of sharing

## Implementation

### 1. Directory Structure
```
src/
├── features/                    # Feature-specific code
│   ├── tasks/                  # Task management feature
│   │   ├── components/         # Task-specific UI components
│   │   ├── hooks/              # Task-specific custom hooks
│   │   ├── context/            # Task-specific state management
│   │   ├── types/              # Task-specific type definitions
│   │   ├── utils/              # Task-specific utilities
│   │   ├── pages/              # Task-specific pages/routes
│   │   ├── forms/              # Task-specific form components
│   │   └── schemas/            # Task-specific validation schemas
│   └── users/                  # User management feature
│       ├── components/
│       ├── hooks/
│       └── ...
├── components/                 # Shared/generic components
│   ├── ui/                     # Base UI components (Shadcn UI)
│   ├── form/                   # Reusable form components
│   └── layout/                 # Layout components
├── hooks/                      # Shared custom hooks
├── lib/                        # Shared utilities and configurations
├── types/                      # Shared type definitions
└── contexts/                   # Global contexts
```

### 2. Feature Organization Guidelines

**Each feature should contain:**
- `components/` - Feature-specific UI components
- `hooks/` - Custom hooks for the feature
- `types/` - TypeScript types specific to the feature
- `utils/` - Utility functions used only by this feature
- `context/` - Feature-specific state management (if needed)
- `pages/` - Route components for the feature
- `schemas/` - Validation schemas for the feature

**Shared directories contain:**
- Code used by multiple features
- Generic/reusable components
- Core utilities and configurations
- Global state management

### 3. Import Rules

```typescript
// ✅ Feature importing from shared
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

// ✅ Feature importing from same feature
import { TaskCard } from './components/TaskCard';
import { useTaskMutations } from './hooks/useTaskMutations';

// ❌ Feature importing from another feature (use shared instead)
import { UserCard } from '@/features/users/components/UserCard'; // BAD

// ✅ Extract to shared if needed by multiple features
import { UserCard } from '@/components/business/UserCard'; // GOOD
```

### 4. Feature Boundary Rules

1. **Features should not directly import from other features**
2. **Shared functionality should be extracted to appropriate shared directories**
3. **Each feature should be as self-contained as possible**
4. **Communication between features should happen through:**
   - Shared contexts
   - URL parameters/routing
   - Shared data layer (React Query)

### 5. Migration Strategy

We migrated existing code gradually:
1. Created feature directories for major business domains
2. Moved feature-specific components, hooks, and utilities
3. Updated import paths throughout the codebase
4. Established clear guidelines for future development

## Notes

- Feature boundaries align with business domains rather than technical concerns
- The pattern scales well as we add new features like reporting, notifications, etc.
- Each feature can potentially be developed by different team members with minimal conflicts
- Clear separation makes it easier to implement feature flags or A/B testing
- Future extraction to micro-frontends becomes more feasible

## References

- [Feature-Sliced Design](https://feature-sliced.design/)
- [Bulletproof React - Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)
- [React Folder Structure](https://www.robinwieruch.de/react-folder-structure/) 