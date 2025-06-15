# Data Access Layer Architecture Design

**Phase 7: Service Abstraction Implementation**  
**Date:** January 2025  
**Status:** Implementation Ready

## 🎯 Objective

Establish a consistent data access layer that eliminates direct service imports in UI components and
provides unified error handling, caching, and type safety patterns.

## 📊 Current State Analysis

### ✅ **Existing Good Patterns**

- **Query Hooks**: `useTaskQuery`, `useTasksQuery` using `useEntityByIdQuery`
- **Mutation Hooks**: `useTaskCreation`, `useTaskUpdates` using `useBaseMutation`
- **Generic Foundations**: `useEntityByIdQuery`, `useBaseMutation` provide excellent base patterns
- **Centralized Error Handling**: `apiRequest` wrapper in services
- **Type Safety**: Strong TypeScript interfaces throughout

### ⚠️ **Issues to Address**

1. **Direct Service Calls**: 3 components still import services directly

   - `FollowUpTaskPage.tsx` → `TaskService.crud.getById()`
   - `useUnifiedPhotoUpload.ts` → `TaskService.media.uploadPhoto()`
   - `useAuthFormState.ts` → `AuthService.signIn/signUp/signOut()`

2. **Missing Abstractions**: No data hooks for photo upload and auth operations
3. **Inconsistent Patterns**: Mixed direct calls vs. hook-based approaches

## 🏗️ Architecture Design

### **Layer 1: Services (Keep Existing)**

```
Services/
├── TaskService (crud, query, status, media)
├── AuthService (signIn, signUp, signOut, getCurrentUser)
└── UserService (getAll)
```

- **Role**: Direct API communication only
- **Import Rule**: Only imported by data access hooks
- **Status**: Keep as-is, well-designed

### **Layer 2: Data Access Hooks (Enhance)**

```
Data Access Hooks/
├── Query Hooks/
│   ├── useTaskQuery ✅ (existing, good)
│   ├── useTasksQuery ✅ (existing, good)
│   └── useUsersQuery ✅ (existing, good)
├── Mutation Hooks/
│   ├── useTaskCreation ✅ (existing, good)
│   ├── useTaskUpdates ✅ (existing, good)
│   ├── useTaskDeletion ✅ (existing, good)
│   ├── usePhotoUpload ❌ (missing - CREATE)
│   └── useAuthMutations ❌ (missing - CREATE)
└── Base Patterns/
    ├── useEntityByIdQuery ✅ (excellent foundation)
    └── useBaseMutation ✅ (excellent foundation)
```

### **Layer 3: UI Components (Refactor)**

- **Import Rule**: Only import from Layer 2 (data hooks)
- **Refactor Needed**: 3 components using direct service calls

## 🔧 Implementation Patterns

### **1. Query Pattern (Existing - Keep)**

```typescript
// Pattern: useEntityByIdQuery wrapper
export function useTaskData(taskId: string) {
  return useEntityByIdQuery<Task>('tasks', taskId, (id: string) => TaskService.query.getById(id), {
    staleTime: 5 * 60 * 1000,
    errorContext: 'task details',
  });
}
```

### **2. Mutation Pattern (Existing - Keep)**

```typescript
// Pattern: useBaseMutation wrapper
export function useTaskCreation() {
  return useBaseMutation<Task, TaskCreationData>({
    mutationFn: data => TaskService.crud.create(data),
    successMessage: 'Task created successfully',
    errorMessagePrefix: 'Failed to create task',
  });
}
```

### **3. Media Upload Pattern (New - Create)**

```typescript
// Pattern: Specialized mutation for file uploads
export function usePhotoUpload() {
  return useMutation({
    mutationFn: (file: File) => TaskService.media.uploadPhoto(file),
    onError: error => {
      logger.error('Photo upload error', error);
      toast.error(`Photo upload failed: ${error.message}`);
    },
    onSuccess: url => {
      toast.success('Photo uploaded successfully');
    },
  });
}
```

### **4. Auth Mutations Pattern (New - Create)**

```typescript
// Pattern: Multiple related mutations in one hook
export function useAuthMutations() {
  const signIn = useMutation({
    mutationFn: ({ email, password }: SignInData) => AuthService.signIn(email, password),
    onSuccess: () => {
      toast.success('Signed in successfully');
      setTimeout(() => (window.location.href = '/'), 1000);
    },
  });

  const signUp = useMutation({
    mutationFn: ({ email, password, metadata }: SignUpData) =>
      AuthService.signUp(email, password, metadata),
    onSuccess: () => {
      toast.success('Account created successfully');
      setTimeout(() => (window.location.href = '/'), 1500);
    },
  });

  return { signIn, signUp, signOut: AuthService.signOut };
}
```

## 📝 Implementation Plan

### **Step 1: Create Missing Data Hooks**

1. **Create `usePhotoUpload`** in `src/shared/hooks/api/`
2. **Create `useAuthMutations`** in `src/shared/hooks/api/`

### **Step 2: Refactor Direct Service Usage**

1. **FollowUpTaskPage.tsx**: Replace direct `TaskService.crud.getById()` with existing
   `useTaskQuery`
2. **useUnifiedPhotoUpload.ts**: Replace direct `TaskService.media.uploadPhoto()` with new
   `usePhotoUpload`
3. **useAuthFormState.ts**: Replace direct `AuthService` calls with new `useAuthMutations`

### **Step 3: Establish Import Rules**

- **Services**: Only imported by data access hooks
- **Components**: Only import data access hooks
- **Enforce**: ESLint rule to prevent direct service imports in components

## 🎯 Success Metrics

### **Code Quality**

- ✅ Zero direct service imports in UI components
- ✅ Consistent error handling across all data operations
- ✅ Unified loading states and user feedback

### **Maintainability**

- ✅ Clear separation between data and UI layers
- ✅ Reusable patterns for future features
- ✅ Type-safe interfaces throughout

### **Performance**

- ✅ Proper caching with TanStack Query
- ✅ Optimistic updates where appropriate
- ✅ Minimal re-renders with stable hook interfaces

## 🔍 Validation Checklist

- [ ] All components use data hooks instead of direct service calls
- [ ] TypeScript compilation passes with zero errors
- [ ] ESLint passes with no import violations
- [ ] Prettier formatting applied consistently
- [ ] Knip shows no unresolved imports
- [ ] All existing functionality preserved
- [ ] Error handling consistent across all operations

## 📚 Benefits

### **Developer Experience**

- **Consistent Patterns**: Same approach for all data operations
- **Better IntelliSense**: Type-safe hook interfaces
- **Easier Testing**: Mock hooks instead of services

### **Code Quality**

- **Single Responsibility**: Components focus on UI, hooks handle data
- **Error Boundaries**: Centralized error handling
- **Performance**: Optimized caching and loading states

### **Maintainability**

- **Clear Boundaries**: No cross-layer violations
- **Reusable Logic**: Base patterns for new features
- **Future-Proof**: Easy to extend and modify

---

**Implementation Status**: Ready for execution  
**Estimated Effort**: 2-3 hours  
**Risk Level**: Low (leveraging existing patterns)
