
# State Management Guidelines

## Overview

This document establishes clear guidelines for state management in our Task Management Application. We follow a hybrid approach using **TanStack Query (React Query)** for server state and **React Context** for client state, with specific patterns for different types of state.

## State Categories

### 1. Server State (Use TanStack Query)

**Definition**: Data that originates from and is synchronized with the server.

**Examples**:
- Tasks from database
- User profiles
- Authentication sessions
- API responses

**Implementation Pattern**:
```typescript
// Query Hook Pattern
export function useTaskQueries(pageSize = 10) {
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['tasks', currentPage, pageSize],
    queryFn: () => TaskService.getMany({ page: currentPage, pageSize }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  return {
    tasks: response?.data || [],
    isLoading,
    error: error ? (error as Error).message : null,
  };
}

// Mutation Hook Pattern
export function useTaskMutations() {
  const queryClient = useQueryClient();

  const toggleTaskComplete = useMutation({
    mutationFn: TaskService.toggleComplete,
    onMutate: (task) => {
      // Optimistic update
      queryClient.setQueryData(['tasks'], (old) => 
        updateTaskInList(old, task.id, { status: 'complete' })
      );
    },
    onError: (_, __, context) => {
      // Rollback on error
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return { toggleTaskComplete };
}
```

### 2. Global Client State (Use React Context)

**Definition**: Application-wide client state that needs to be shared across components.

**Examples**:
- Theme preferences
- Authentication state
- Global UI settings

**Implementation Pattern**:
```typescript
// Context Creation with Standardized Pattern
const { Provider: AuthProvider, useContext: useAuth } = createStandardContext<AuthContextType>({
  name: 'Auth',
  errorMessage: 'useAuth must be used within an AuthProvider'
});

// Provider Implementation
export function AuthProvider({ children }: { children: ReactNode }) {
  const authState = useAuth();

  return (
    <AuthProvider value={authState}>
      {children}
    </AuthProvider>
  );
}
```

### 3. Feature-Specific Client State (Use React Context)

**Definition**: Client state scoped to specific features or component trees.

**Examples**:
- Task UI filters
- Expanded/collapsed states
- Form state within features

**Implementation Pattern**:
```typescript
// Feature-Specific Context
export function TaskUIContextProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const value = useMemo(() => ({
    filter,
    setFilter,
    expandedTaskId,
    setExpandedTaskId,
  }), [filter, expandedTaskId]);

  return (
    <TaskUIContext.Provider value={value}>
      {children}
    </TaskUIContext.Provider>
  );
}
```

### 4. Local Component State (Use React useState/useReducer)

**Definition**: State that is only relevant to a single component or its immediate children.

**Examples**:
- Form input values
- Modal open/closed state
- Loading states for component-specific actions

**Implementation Pattern**:
```typescript
function TaskCard({ task }: { task: Task }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Component-specific logic
  const handleToggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return (
    // Component JSX
  );
}
```

## Decision Matrix

| State Type | Scope | Persistence | Tool | Example |
|------------|-------|-------------|------|---------|
| Server Data | Global | Server | React Query | Tasks, Users |
| Auth State | Global | Local Storage | React Context + React Query | User session |
| UI Preferences | Global | Local Storage | React Context | Theme, Language |
| Feature UI State | Feature | Session | React Context | Task filters |
| Component State | Component | Memory | useState/useReducer | Form inputs |

## Implementation Guidelines

### 1. Query Key Management

**Centralize query keys** for consistency and easy invalidation:

```typescript
// src/lib/queryKeys.ts
export const queryKeys = {
  tasks: ['tasks'] as const,
  task: (id: string) => ['tasks', id] as const,
  tasksByUser: (userId: string) => ['tasks', 'user', userId] as const,
  users: ['users'] as const,
} as const;
```

### 2. Context Hierarchy

**Establish clear provider hierarchy** to avoid dependency issues:

```typescript
// Correct Provider Order
function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

### 3. Error Handling Patterns

**Standardize error handling** across state management:

```typescript
// Query Error Handling
const { data, isLoading, error } = useQuery({
  queryKey: ['tasks'],
  queryFn: TaskService.getMany,
  throwOnError: false, // Handle errors in component
});

if (error) {
  return <ErrorDisplay message={error.message} />;
}

// Mutation Error Handling
const mutation = useMutation({
  mutationFn: TaskService.create,
  onError: (error) => {
    toast.error(`Failed to create task: ${error.message}`);
  },
  onSuccess: () => {
    toast.success('Task created successfully');
  },
});
```

### 4. Loading State Management

**Consistent loading state patterns**:

```typescript
// Query Loading States
const { data: tasks, isLoading, isFetching } = useTaskQueries();

// Show initial loading
if (isLoading) {
  return <TaskListSkeleton />;
}

// Show background loading
return (
  <div>
    {isFetching && <LoadingIndicator />}
    <TaskList tasks={tasks} />
  </div>
);
```

## Best Practices

### 1. Avoid State Duplication

- Don't duplicate server state in client state
- Use React Query as the single source of truth for server data
- Derive computed state instead of storing it

### 2. Optimize Re-renders

```typescript
// Use useMemo for expensive computations
const filteredTasks = useMemo(() => 
  tasks.filter(task => task.status === filter),
  [tasks, filter]
);

// Use useCallback for event handlers
const handleTaskComplete = useCallback((taskId: string) => {
  toggleTaskComplete({ taskId });
}, [toggleTaskComplete]);
```

### 3. State Normalization

**For complex nested data**, consider normalization:

```typescript
// Normalized State Structure
interface TaskState {
  byId: Record<string, Task>;
  allIds: string[];
  filter: TaskFilter;
}

// Selector Pattern
const selectTasksByFilter = (state: TaskState, filter: TaskFilter) =>
  state.allIds
    .map(id => state.byId[id])
    .filter(task => task.status === filter);
```

### 4. Context Splitting

**Split contexts by concern** to avoid unnecessary re-renders:

```typescript
// Split UI state from data state
<TaskDataContextProvider>
  <TaskUIContextProvider>
    <TaskList />
  </TaskUIContextProvider>
</TaskDataContextProvider>
```

## Testing Guidelines

### 1. Test Context Providers

```typescript
// Test Provider Wrapper
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={testQueryClient}>
    <TaskDataContextProvider>
      {children}
    </TaskDataContextProvider>
  </QueryClientProvider>
);

// Test Component with Context
test('displays filtered tasks', () => {
  render(<TaskList />, { wrapper: TestWrapper });
  // Test assertions
});
```

### 2. Mock React Query

```typescript
// Mock Query Hook
vi.mock('@/features/tasks/hooks/useTaskQueries', () => ({
  useTaskQueries: () => ({
    tasks: mockTasks,
    isLoading: false,
    error: null,
  }),
}));
```

## Migration Strategy

### When to Refactor State Management

1. **Move to React Query** when:
   - Component state becomes server data
   - Need caching or background sync
   - Multiple components need same server data

2. **Move to Context** when:
   - Local state needs to be shared
   - Prop drilling becomes excessive
   - State crosses feature boundaries

3. **Keep in useState** when:
   - State is truly component-local
   - No sharing needed
   - Simple UI state

## Common Anti-patterns to Avoid

### ❌ Don't Do This

```typescript
// Storing server data in component state
const [tasks, setTasks] = useState([]);
useEffect(() => {
  TaskService.getMany().then(setTasks);
}, []);

// Duplicating query data in context
const [tasks, setTasks] = useState([]);
const { data } = useQuery(['tasks'], TaskService.getMany);
useEffect(() => {
  if (data) setTasks(data);
}, [data]);

// Overly broad context
const AppContext = createContext({
  user, setUser,
  tasks, setTasks,
  theme, setTheme,
  // ... 20+ other values
});
```

### ✅ Do This Instead

```typescript
// Use React Query for server data
const { data: tasks, isLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: TaskService.getMany,
});

// Split contexts by concern
const UserProvider = ({ children }) => (
  <UserContext.Provider value={{ user, setUser }}>
    {children}
  </UserContext.Provider>
);

const ThemeProvider = ({ children }) => (
  <ThemeContext.Provider value={{ theme, setTheme }}>
    {children}
  </ThemeContext.Provider>
);
```

## References

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Context Best Practices](https://react.dev/reference/react/createContext)
- [ADR-0001: React Query State Management](./adr/ADR-0001-react-query-state-management.md)
