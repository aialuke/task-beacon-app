
# Import Patterns and Styling Guidelines

This document covers import organization, styling patterns, and file structure guidelines.

## Import Order and Patterns

### Standardized Import Order

1. React and React-related imports
2. Third-party libraries  
3. UI components (from `@/components/ui`)
4. Business components (from `@/components/business`)
5. Feature components
6. Hooks (context, queries, mutations, custom)
7. Utilities (direct imports preferred)
8. Types and interfaces
9. Assets and styles

### Import Pattern Standards

#### 1. Direct Imports (Preferred)
```typescript
import { formatDate } from "@/lib/dateUtils";
import { compressAndResizePhoto } from "@/lib/imageUtils";
import { useTaskMutations } from "@/features/tasks/hooks/useTaskMutations";
```

#### 2. Barrel Imports (Common utilities only)
```typescript
import { cn, formatDate, truncateText } from "@/lib/utils";
```

#### 3. Feature Imports
```typescript
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { useTaskContext } from "@/features/tasks/context/TaskContext";
```

## Animation and Styling

### CSS Class Organization

- **Tailwind utilities**: Primary styling approach
- **Component-specific styles**: In dedicated CSS files
- **Animation classes**: Defined in utilities/animations.css

### Animation Patterns

- **CSS transitions**: For simple state changes
- **React Spring**: For complex animations
- **Performance**: Use `transform` and `opacity` properties

## File Organization

- **Small files**: Prefer multiple small files over large ones
- **Single responsibility**: One main export per file
- **Clear naming**: File names should match their primary export
- **Feature grouping**: Group related files in feature directories
