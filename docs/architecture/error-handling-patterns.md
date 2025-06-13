# Error Handling Patterns - Data Access Layer

**Phase 7: Service Abstraction - Error Handling Standardization**  
**Date:** January 2025  
**Status:** Implemented

## 🎯 Objective

Establish consistent error handling patterns across all data access hooks to provide unified user
feedback, logging, and error recovery mechanisms.

## 📊 Current Implementation

### **Standardized Error Handling Utility**

Location: `src/shared/hooks/api/useErrorHandling.ts`

### **Core Functions**

#### **1. handleDataAccessError()**

```typescript
handleDataAccessError(error: unknown, options: DataAccessErrorOptions): DataAccessErrorResult
```

- **Purpose**: Standardized error processing for all data operations
- **Features**:
  - Consistent error formatting using existing `formatApiError`
  - Automatic logging with operation context
  - User-friendly toast notifications
  - Structured error result objects

#### **2. handleDataAccessSuccess()**

```typescript
handleDataAccessSuccess(operation: string, showToast?: boolean): void
```

- **Purpose**: Standardized success feedback
- **Features**:
  - Consistent success message formatting
  - Automatic capitalization for user-friendly messages
  - Optional toast notification control

#### **3. withDataAccessErrorHandling()**

```typescript
withDataAccessErrorHandling<TArgs, TResult>(
  asyncFn: (...args: TArgs) => Promise<TResult>,
  operation: string,
  options?: DataAccessErrorOptions
): Promise<TResult | DataAccessErrorResult>
```

- **Purpose**: Error boundary wrapper for async operations
- **Features**:
  - Automatic error catching and processing
  - Consistent error result format
  - Type-safe error handling

## 🏗️ Implementation Patterns

### **1. Data Access Hook Pattern**

```typescript
export function useDataOperation() {
  const mutation = useMutation({
    mutationFn: async data => {
      const response = await Service.operation(data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Operation failed');
      }
      return response.data;
    },
    onError: (error: Error) => {
      handleDataAccessError(error, { operation: ErrorPatterns.OPERATION_FAILED });
    },
    onSuccess: () => {
      handleDataAccessSuccess('operation name');
    },
  });

  return {
    execute: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error?.message || null,
  };
}
```

### **2. Component Error Handling Pattern**

```typescript
function Component() {
  const { execute, isLoading, error } = useDataOperation();

  const handleSubmit = async (data) => {
    try {
      const result = await execute(data);
      // Handle success
    } catch (error) {
      // Error already handled by hook
      // Optional: component-specific error handling
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <button disabled={isLoading}>Submit</button>
    </form>
  );
}
```

## 📋 Error Patterns Catalog

### **Pre-defined Error Operations**

```typescript
export const ErrorPatterns = {
  // Query operations
  FETCH_FAILED: 'fetch data',
  LOAD_FAILED: 'load data',

  // Mutation operations
  CREATE_FAILED: 'create item',
  UPDATE_FAILED: 'update item',
  DELETE_FAILED: 'delete item',

  // Auth operations
  SIGNIN_FAILED: 'sign in',
  SIGNUP_FAILED: 'sign up',
  SIGNOUT_FAILED: 'sign out',

  // Media operations
  UPLOAD_FAILED: 'upload file',
  DOWNLOAD_FAILED: 'download file',
} as const;
```

### **Custom Error Handlers**

```typescript
// Create operation-specific error handler
const taskErrorHandler = createErrorHandler('manage tasks');

// Use in hook
onError: (error) => taskErrorHandler.handle(error),

// Wrap async function
const safeTaskOperation = taskErrorHandler.wrap(unsafeTaskOperation);
```

## 🎯 Implementation Status

### **✅ Completed**

1. **Standardized Error Utility**: `useErrorHandling.ts` created
2. **Updated Data Access Hooks**:
   - `usePhotoUpload` - Uses standardized error handling
   - `useAuthMutations` - Uses standardized error handling
3. **Error Pattern Catalog**: Pre-defined error operations
4. **Type Safety**: Full TypeScript interfaces for error handling

### **🔄 Existing Patterns (Maintained)**

- **useBaseMutation**: Already has good error handling patterns
- **Task Mutation Hooks**: Use useBaseMutation, inherit good patterns
- **Query Hooks**: Use existing error handling from useEntityByIdQuery

## 🔍 Error Handling Flow

### **1. Error Occurs in Service Call**

```
Service Error → formatApiError() → Structured ApiError
```

### **2. Error Processing in Hook**

```
ApiError → handleDataAccessError() → {
  - Log with operation context
  - Show user-friendly toast
  - Return structured error result
}
```

### **3. Component Receives Error**

```
Structured Error → Component State → UI Error Display
```

## 📊 Benefits Achieved

### **Consistency**

- ✅ Unified error message formatting across all operations
- ✅ Consistent logging patterns with operation context
- ✅ Standardized user feedback through toast notifications

### **Developer Experience**

- ✅ Type-safe error handling interfaces
- ✅ Pre-defined error patterns for common operations
- ✅ Reusable error handling utilities

### **User Experience**

- ✅ Consistent error message formatting
- ✅ Appropriate error feedback for different operation types
- ✅ Clear success confirmations

### **Maintainability**

- ✅ Centralized error handling logic
- ✅ Easy to update error patterns globally
- ✅ Consistent debugging information

## 🔧 Usage Guidelines

### **For New Data Access Hooks**

1. Import error handling utilities from `@/shared/hooks/api`
2. Use `handleDataAccessError` in `onError` callbacks
3. Use `handleDataAccessSuccess` in `onSuccess` callbacks
4. Choose appropriate error pattern from `ErrorPatterns`

### **For Component Error Handling**

1. Use hook-provided error states for UI display
2. Let hooks handle standard error feedback
3. Add component-specific error handling only when needed
4. Use `isDataAccessError` type guard for error checking

### **For Custom Error Scenarios**

1. Use `createErrorHandler` for operation-specific handlers
2. Use `withDataAccessErrorHandling` for wrapping async functions
3. Extend `ErrorPatterns` for new operation types
4. Maintain consistency with existing patterns

---

**Implementation Status**: Complete  
**Coverage**: All new data access hooks  
**Backward Compatibility**: Maintained with existing patterns
