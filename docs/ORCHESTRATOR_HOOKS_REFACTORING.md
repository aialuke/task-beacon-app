# Orchestrator Hooks Refactoring Guide

This guide documents the refactoring of large orchestrator hooks into smaller, focused hooks as per the architecture audit recommendations.

## Overview

Large orchestrator hooks that mixed multiple concerns have been split into focused hooks, each handling a single responsibility. The orchestrators now act as thin composition layers.

## Refactoring Principles

1. **Single Responsibility**: Each hook handles one specific concern
2. **Composability**: Hooks can be easily combined
3. **Testability**: Smaller hooks are easier to test in isolation
4. **Reusability**: Focused hooks can be reused in different contexts

## Refactored Hooks

### 1. Form State Management

**Before**: Mixed with validation and photo upload in `useTaskForm`

**After**: 
- `useTaskFormState` - Pure state management
- `useTaskForm` - Thin orchestrator combining state + validation
- Photo upload handled separately

### 2. Task Submission

**Before**: Mixed with validation, navigation, and error handling in `useCreateTask`

**After**:
- `useTaskSubmission` - API calls and error handling
- `useTaskNavigation` - Navigation side effects
- `useCreateTask` - Thin orchestrator

### 3. Validation

**Before**: Scattered across multiple hooks

**After**:
- `useTaskFormValidation` - All validation logic
- Integrated with form hooks via composition

## New Hook Architecture

```
┌─────────────────────────────────────────┐
│          Orchestrator Hooks             │
│  (useCreateTask, useUpdateTask, etc.)   │
└─────────────────┬───────────────────────┘
                  │ Composes
┌─────────────────┴───────────────────────┐
│           Focused Hooks                  │
├──────────────┬──────────────┬───────────┤
│   State      │ Validation   │   API     │
│ Management   │              │  Calls    │
├──────────────┼──────────────┼───────────┤
│useTaskForm   │useTaskForm   │useTask    │
│State         │Validation    │Submission │
└──────────────┴──────────────┴───────────┘
```

## Example: useCreateTask Refactoring

### Before (Monolithic)
```typescript
export function useCreateTask() {
  // Mixed concerns: form state, validation, API calls, navigation, photo upload
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  // ... more state
  
  const handleSubmit = async () => {
    // Validation logic
    // Photo upload logic
    // API call logic
    // Navigation logic
    // Error handling
  };
  
  return { /* everything */ };
}
```

### After (Composed)
```typescript
export function useCreateTask({ onClose }: UseCreateTaskProps = {}) {
  // Compose focused hooks
  const { navigateToDashboard } = useTaskNavigation();
  const { submitTask } = useTaskSubmission();
  const taskForm = useTaskForm();
  const photoUpload = useEnhancedTaskPhotoUpload();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Each hook handles its own concern
    if (!taskForm.validateForm().isValid) return;
    
    const photoUrl = await photoUpload.uploadPhoto();
    const result = await submitTask({ ...taskForm, photoUrl });
    
    if (result.success) {
      taskForm.resetFormState();
      navigateToDashboard();
    }
  }, [taskForm, photoUpload, submitTask, navigateToDashboard]);

  return {
    ...taskForm,
    ...photoUpload,
    handleSubmit,
  };
}
```

## Benefits

1. **Reduced Complexity**: Each hook is smaller and easier to understand
2. **Better Testing**: Can test each concern in isolation
3. **Increased Reusability**: Can use `useTaskSubmission` in multiple contexts
4. **Clearer Dependencies**: Easy to see what each hook depends on
5. **Easier Maintenance**: Changes to one concern don't affect others

## Migration Guide

When refactoring an orchestrator hook:

1. **Identify Concerns**: List all responsibilities of the hook
2. **Create Focused Hooks**: One hook per concern
3. **Keep Interfaces Stable**: Maintain the same return values
4. **Compose in Orchestrator**: Combine focused hooks
5. **Test Each Layer**: Write tests for focused hooks and orchestrator

## Testing Strategy

### Focused Hook Tests
```typescript
// Test state management in isolation
describe('useTaskFormState', () => {
  it('manages form state', () => {
    const { result } = renderHook(() => useTaskFormState());
    act(() => result.current.setTitle('Test'));
    expect(result.current.title).toBe('Test');
  });
});

// Test API calls in isolation
describe('useTaskSubmission', () => {
  it('submits task data', async () => {
    const { result } = renderHook(() => useTaskSubmission());
    const response = await result.current.submitTask(mockData);
    expect(response.success).toBe(true);
  });
});
```

### Orchestrator Tests
```typescript
// Test composition and coordination
describe('useCreateTask', () => {
  it('coordinates form submission workflow', async () => {
    const { result } = renderHook(() => useCreateTask());
    
    // Fill form
    act(() => result.current.setTitle('Test Task'));
    
    // Submit
    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });
    
    // Verify coordination
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
```

## Next Steps

1. Apply similar refactoring to other large hooks:
   - `useTaskWorkflow`
   - `useFollowUpTask`
   - Other orchestrator hooks

2. Create shared patterns for common compositions

3. Document hook dependencies and usage patterns 