# Type System Organization Plan

## 🎯 Objectives

### 1. Standardize Type Organization
- ✅ Consolidate shared types in `src/types/`
- ✅ Keep feature-specific types in feature directories
- ✅ Create clear type export patterns
- ✅ Eliminate duplicate type definitions
- ✅ Establish consistent naming conventions

## 📁 New Type Organization Structure

### Core Types Directory (`src/types/`)
```
src/types/
├── index.ts                    # Main type exports (barrel file)
├── shared/                     # Shared domain types
│   ├── index.ts               # Shared types barrel
│   ├── common.types.ts        # Common utility types
│   ├── api.types.ts           # API response types
│   ├── auth.types.ts          # Authentication types
│   ├── database.types.ts      # Database-related types
│   └── ui.types.ts            # Shared UI types
├── feature-types/             # Cross-feature types
│   ├── index.ts               # Feature types barrel
│   ├── task.types.ts          # Core task domain types
│   └── user.types.ts          # Core user domain types
└── utility/                   # TypeScript utility types
    ├── index.ts               # Utility types barrel
    ├── form.types.ts          # Form utility types
    ├── validation.types.ts    # Validation types
    └── helpers.types.ts       # Type helpers and utilities
```

### Feature-Specific Types
```
src/features/[feature]/types/
├── index.ts                   # Feature types barrel
├── components.types.ts        # Component prop types
├── hooks.types.ts             # Hook return/param types
├── context.types.ts           # Context types
└── [feature]-specific.types.ts # Feature-specific business logic types
```

## 🏗️ Implementation Strategy

### Phase 1: Consolidate Shared Types
1. **Merge duplicate definitions**
   - Consolidate `ApiResponse`/`ApiError` from `lib/api/base.ts` and `types/api.types.ts`
   - Move core domain types to `src/types/feature-types/`
   
2. **Create new shared type categories**
   - `common.types.ts` - Utility types, generic interfaces
   - `api.types.ts` - API response patterns, error types
   - `auth.types.ts` - Authentication and authorization types
   - `database.types.ts` - Database interaction types

### Phase 2: Organize Feature Types
1. **Standardize feature type structure**
   - Create `src/features/users/types/` directory
   - Reorganize `src/features/tasks/types/` for consistency
   
2. **Separate concerns within features**
   - Component prop types → `components.types.ts`
   - Hook interfaces → `hooks.types.ts`
   - Context types → `context.types.ts`
   - Business logic types → `[feature]-specific.types.ts`

### Phase 3: Create Clear Export Patterns
1. **Barrel exports for every type directory**
2. **Consistent naming conventions**
3. **Proper re-export patterns**
4. **Clear import paths**

## 📋 Type Categories

### Shared Types (src/types/shared/)
- **Common**: Basic utility types, generic interfaces
- **API**: Response patterns, error handling, pagination
- **Auth**: User authentication, sessions, permissions
- **Database**: Query types, table interfaces, operations
- **UI**: Layout types, theme types, component base types

### Feature Types (src/types/feature-types/)
- **Task Types**: Core task domain models
- **User Types**: Core user domain models
- **Cross-feature Types**: Types used by multiple features

### Feature-Specific Types (src/features/[feature]/types/)
- **Component Types**: Props, state, UI-specific interfaces
- **Hook Types**: Custom hook parameters and return types
- **Context Types**: React context interfaces
- **Business Logic**: Feature-specific domain types

### Utility Types (src/types/utility/)
- **Form Types**: Form state, validation, input types
- **Validation Types**: Validation results, rule types
- **Helper Types**: TypeScript utility types, branded types

## 🎯 Benefits

### 1. **Improved Developer Experience**
- ✅ Clear import paths: `import { Task } from '@/types'`
- ✅ IntelliSense autocomplete for all type categories
- ✅ Consistent patterns across the application
- ✅ Easy to find and update type definitions

### 2. **Better Maintainability**
- ✅ No duplicate type definitions
- ✅ Single source of truth for shared types
- ✅ Feature types stay with their features
- ✅ Clear separation of concerns

### 3. **Enhanced Type Safety**
- ✅ Consistent type usage across features
- ✅ Better error messages from TypeScript
- ✅ Easier refactoring with confident type checking
- ✅ Reduced risk of type mismatches

## 🔄 Migration Strategy

### Step 1: Create New Structure
1. Create new directory structure
2. Move existing types to appropriate locations
3. Update import statements

### Step 2: Consolidate Duplicates
1. Identify and merge duplicate types
2. Update all references to use single source
3. Remove old duplicate files

### Step 3: Standardize Exports
1. Create barrel files for all type directories
2. Update main `src/types/index.ts`
3. Test all imports work correctly

### Step 4: Feature Organization
1. Create missing feature type directories
2. Move feature-specific types
3. Update feature imports

## 📏 Naming Conventions

### Type Names
- **Interfaces**: PascalCase with descriptive names (`TaskCreateParams`)
- **Types**: PascalCase with clear purpose (`TaskStatus`)
- **Generics**: Single uppercase letter or descriptive (`T`, `TData`)

### File Names
- **Type files**: kebab-case with `.types.ts` suffix
- **Barrel files**: `index.ts`
- **Categories**: singular noun (e.g., `api.types.ts`, not `apis.types.ts`)

### Export Patterns
```typescript
// ✅ Named exports for better tree-shaking
export interface TaskCreateParams { ... }
export type TaskStatus = 'pending' | 'complete';

// ✅ Barrel exports with clear re-exports
export type { TaskCreateParams, TaskStatus } from './task.types';

// ✅ Grouped exports by category
export type {
  // API types
  ApiResponse,
  ApiError,
  PaginatedResponse,
} from './shared/api.types';
```

## 🚀 Implementation Timeline

### Week 4 - Type System Organization
- **Day 1-2**: Create new directory structure and move shared types
- **Day 3**: Consolidate duplicate types and update imports
- **Day 4**: Organize feature-specific types
- **Day 5**: Create comprehensive barrel exports and documentation

## ✅ Success Criteria

1. **Zero duplicate type definitions**
2. **Consistent type organization across all features**
3. **Clear import paths for all type categories**
4. **Comprehensive barrel exports**
5. **All existing functionality works without changes**
6. **TypeScript build passes with zero errors**
7. **Improved IntelliSense experience for developers**

## 📖 Usage Examples

### After Organization - Clean Imports
```typescript
// Shared types
import { ApiResponse, Task, User } from '@/types';

// Feature-specific types
import { TaskUIProps } from '@/features/tasks/types';
import { UserProfileProps } from '@/features/users/types';

// Utility types
import { FormState, ValidationResult } from '@/types/utility';
```

### Clear Type Categories
```typescript
// Core domain types
import { Task, TaskStatus } from '@/types/feature-types';

// API integration types
import { ApiResponse, PaginatedResponse } from '@/types/shared';

// UI component types
import { TaskCardProps } from '@/features/tasks/types';
```

This organization will provide a **solid foundation** for type safety and developer experience while maintaining clear separation of concerns. 