# Task Validation Migration Guide

This guide documents the migration from the old mixed validation approach to the new unified Zod-based validation system.

## Overview

All task validation logic has been consolidated into a single source of truth using Zod schemas located in `src/features/tasks/schemas/taskSchema.ts`.

## Key Changes

### 1. Validation Location
- **Old**: Scattered across multiple files (`src/hooks/useTaskValidation.ts`, `src/lib/validation/`, feature-specific hooks)
- **New**: Centralized in `src/features/tasks/` directory

### 2. Validation Strategy
- **Old**: Mix of custom validation functions and Zod
- **New**: 100% Zod-based with consistent patterns

### 3. Character Limits
- **Old**: Inconsistent (title: 200 in some places, 22 in others)
- **New**: Consistent with database constraints (title: 22, description: 500)

## Migration Steps

### For Existing Code Using Global Validation

```typescript
// Old
import { useTaskValidation } from '@/hooks/useTaskValidation';

const { validateTask } = useTaskValidation();
const result = validateTask({
  title: 'Task',
  description: null,
  url_link: null,
  due_date: null,
});

// New
import { useTaskFormValidation } from '@/features/tasks/hooks/useTaskFormValidation';

const { validateCreateTask } = useTaskFormValidation();
const result = validateCreateTask({
  title: 'Task',
  description: undefined,
  url: undefined,
  dueDate: undefined,
});
```

### For Direct Validation Function Imports

```typescript
// Old - THESE FUNCTIONS HAVE BEEN REMOVED
// import { validateTaskTitle, validateTaskDescription } from '@/lib/validation';

// New
import { validateTaskTitle, validateTaskDescription } from '@/features/tasks/schemas/taskSchema';

const titleResult = validateTaskTitle('My Task');
const descResult = validateTaskDescription('Description');
// Note: These now return SafeParseReturnType with success/error details
```

### For Form Validation

```typescript
// Old
import { useTaskValidation } from '@/features/tasks/hooks/useTaskValidation';

const { validateTitle, createTitleSetter } = useTaskValidation();

// New (same import, enhanced functionality)
import { useTaskFormValidation } from '@/features/tasks/hooks/useTaskFormValidation';

const { 
  validateTitle,        // Still returns boolean
  validateField,        // Field-level validation
  validateTaskForm,     // Complete form validation
  createTitleSetter,    // Same API
  showValidationErrors, // New: Toast notifications
} = useTaskFormValidation();
```

## New Features

### 1. Type-Safe Validation Results
```typescript
const result = validateTaskForm(formData);
if (result.isValid) {
  // result.data is fully typed as TaskFormInput
  console.log(result.data.title); // TypeScript knows this exists
}
```

### 2. Automatic Data Transformation
```typescript
// Titles are automatically trimmed
const result = validateCreateTask({ title: '  My Task  ' });
console.log(result.data?.title); // 'My Task'
```

### 3. Integrated Error Display
```typescript
const { showValidationErrors } = useTaskFormValidation();

// Automatically shows toast notifications
showValidationErrors({
  title: 'Title is required',
  description: 'Description too long',
});
```

### 4. Field-Specific Validation
```typescript
const { validateField } = useTaskFormValidation();

// Validate individual fields
const titleValidation = validateField('title', value);
if (!titleValidation.isValid) {
  console.log(titleValidation.error); // Specific error message
}
```

## Removed Functions

The following functions have been **REMOVED** from `@/lib/validation`:

- ❌ `validateTaskTitle` - Use `@/features/tasks/schemas/taskSchema`
- ❌ `validateTaskDescription` - Use `@/features/tasks/schemas/taskSchema`
- ❌ `validateTaskData` - Use `@/features/tasks/hooks/useTaskFormValidation`

The global hook `@/hooks/useTaskValidation` now re-exports from the feature directory for backward compatibility but is deprecated.

## Benefits

1. **Single Source of Truth**: All validation rules in one place
2. **Type Safety**: Automatic TypeScript inference from Zod schemas
3. **Consistency**: Same validation on client and can be reused on server
4. **Better DX**: Clear error messages, automatic transformations
5. **Maintainability**: Easy to update validation rules in one location

## Common Patterns

### Creating a New Task
```typescript
const { prepareTaskData } = useTaskFormValidation();

const taskData = prepareTaskData(formData);
if (taskData) {
  // Data is validated and transformed
  await createTask(taskData);
}
// Errors are automatically shown via toast
```

### Form with Real-time Validation
```typescript
const { validateField, createTitleSetter } = useTaskFormValidation();

// In your component
const [title, setTitle] = useState('');
const [titleError, setTitleError] = useState<string>();

const handleTitleChange = (value: string) => {
  const validation = validateField('title', value);
  setTitleError(validation.error);
  
  // Use createTitleSetter to enforce character limit
  const setter = createTitleSetter(setTitle);
  setter(value);
};
```

### Complete Form Validation
```typescript
const { validateTaskForm } = useTaskFormValidation();

const handleSubmit = (e: FormEvent) => {
  e.preventDefault();
  
  const validation = validateTaskForm(formData);
  if (!validation.isValid) {
    // Show field-specific errors
    Object.entries(validation.errors).forEach(([field, error]) => {
      setFieldError(field, error);
    });
    return;
  }
  
  // Proceed with validated data
  submitTask(validation.data);
};
```

## Testing

All validation logic is now easily testable:

```typescript
import { taskTitleSchema, createTaskSchema } from '@/features/tasks/schemas/taskSchema';

// Test individual field schemas
expect(taskTitleSchema.parse('Valid Title')).toBe('Valid Title');
expect(() => taskTitleSchema.parse('')).toThrow();

// Test complete schemas
const validTask = createTaskSchema.parse({
  title: 'Task',
  description: 'Desc',
});
expect(validTask.priority).toBe('medium'); // Default applied
```

## Questions?

If you encounter any issues during migration, please check:
1. The test file at `src/features/tasks/hooks/useTaskFormValidation.test.ts` for usage examples
2. The schema definitions in `src/features/tasks/schemas/taskSchema.ts`
3. The main validation hook at `src/features/tasks/hooks/useTaskFormValidation.ts` 