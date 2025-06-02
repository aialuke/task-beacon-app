# ADR-0001: React Query for State Management

## Status
**Accepted** (December 2024)

## Context

The application needed a robust solution for managing server state, data fetching, caching, and synchronization. Traditional state management solutions like Redux are excellent for client state but add complexity when dealing with server state management.

Key requirements:
- Efficient data fetching and caching
- Background updates and refetching
- Optimistic updates for better UX
- Error handling and retry logic
- Loading states management
- Data synchronization across components
- Offline support capabilities

## Decision

We decided to adopt **TanStack Query (React Query) v5** as our primary state management solution for server state, while using React Context API for limited global client state needs.

## Alternatives Considered

### 1. Redux Toolkit + RTK Query
**Pros:**
- Industry standard with large ecosystem
- Excellent DevTools
- Predictable state updates
- Good for complex state logic

**Cons:**
- Significant boilerplate even with Redux Toolkit
- Steep learning curve
- Overkill for our use case
- Complex setup for async operations

### 2. Zustand + SWR
**Pros:**
- Lightweight and simple
- Good TypeScript support
- Minimal boilerplate

**Cons:**
- Less mature ecosystem
- Would require combining two libraries
- Less comprehensive caching strategy

### 3. Apollo Client (with GraphQL)
**Pros:**
- Excellent caching and state management
- Built-in optimistic updates
- Strong ecosystem

**Cons:**
- Requires GraphQL backend (we use Supabase REST APIs)
- Heavy for our needs
- Additional complexity

### 4. React Context + useEffect
**Pros:**
- Built into React
- Simple for basic cases

**Cons:**
- No built-in caching
- Manual loading state management
- Performance issues with frequent updates
- No background refetching

## Consequences

### Positive
- **Reduced Boilerplate**: React Query handles loading, error, and success states automatically
- **Better User Experience**: Background updates, optimistic updates, and caching improve perceived performance
- **Developer Experience**: Excellent DevTools and TypeScript support
- **Performance**: Intelligent caching and request deduplication
- **Offline Support**: Built-in support for offline scenarios
- **Error Handling**: Centralized error handling with retry logic

### Negative
- **Learning Curve**: Team needs to learn React Query patterns and best practices
- **Bundle Size**: Adds ~50KB to the bundle (acceptable for the features provided)
- **API Design**: Need to structure API layer to work well with React Query patterns

## Implementation

### 1. Query Structure
```typescript
// Centralized query keys
export const queryKeys = {
  tasks: ['tasks'] as const,
  task: (id: string) => ['tasks', id] as const,
  users: ['users'] as const,
} as const;
```

### 2. Custom Hooks Pattern
```typescript
// Feature-specific query hooks
export function useTaskQueries() {
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: queryKeys.tasks,
    queryFn: () => TaskService.getMany(),
  });
  
  return { tasks, isLoading, error };
}
```

### 3. Mutation Hooks
```typescript
// Centralized mutations with optimistic updates
export function useTaskMutations() {
  const queryClient = useQueryClient();
  
  const toggleComplete = useMutation({
    mutationFn: TaskService.toggleComplete,
    onMutate: (task) => {
      // Optimistic update
      queryClient.setQueryData(queryKeys.tasks, (old) => 
        updateTaskInList(old, task.id, { status: 'complete' })
      );
    },
    onError: (_, __, context) => {
      // Rollback on error
      queryClient.setQueryData(queryKeys.tasks, context?.previousTasks);
    },
  });
  
  return { toggleComplete };
}
```

### 4. Global Configuration
```typescript
// React Query client setup
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 5. Error Boundary Integration
React Query errors are handled by our global ErrorBoundary and custom error handling utilities.

## Notes

- Query keys are centralized in `src/lib/queryKeys.ts` for consistency
- All server state should use React Query; client state uses React Context sparingly
- Optimistic updates are preferred for better UX where safe to implement
- Background refetching is configured based on data freshness requirements
- DevTools are enabled in development for debugging query states

## References

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Query Best Practices](https://react-query.tanstack.com/guides/best-practices)
- [Practical React Query](https://tkdodo.eu/blog/practical-react-query) 