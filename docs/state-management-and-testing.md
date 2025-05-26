
# State Management and Testing Patterns

This document covers state management strategies and testing conventions.

## State Management Patterns

### Context Usage

- **Global State**: Authentication, theme, UI preferences
- **Feature State**: Feature-specific data and operations
- **Component State**: Local component state only

### Context Structure

```tsx
interface ContextValue {
  // State
  data: DataType;
  
  // Actions
  updateData: (data: DataType) => void;
  
  // Computed values
  isLoading: boolean;
}
```

## Form Handling Patterns

### Standardized Form Validation

All forms use the `useFormWithValidation` hook pattern:

```tsx
const form = useFormWithValidation({
  schema: validationSchema,
  defaultValues,
  onSubmit: handleSubmit,
  successMessage: "Success message"
});
```

### Form Component Structure

1. **Form Hook**: Handles state and validation
2. **Form Component**: Renders UI and handles user interaction
3. **Field Components**: Reusable form field components

## Error Handling

### Three-Layer Approach

1. **API Layer**: Standardized error format with `handleApiError`
2. **Hook Layer**: Try/catch with toast notifications
3. **UI Layer**: Error boundaries and fallback components

## Testing Conventions

- **Unit tests**: One test file per utility/hook
- **Component tests**: User interaction focused
- **Mocks**: External dependencies (Supabase, etc.)
- **Test IDs**: `data-testid` for component queries

### Testing Patterns

```typescript
// Unit test example
describe('formatDate', () => {
  it('should format date correctly', () => {
    // Test implementation
  });
});

// Component test example
describe('TaskCard', () => {
  it('should toggle expansion on click', () => {
    // Test user interaction
  });
});
```
