
# Performance Optimization Guidelines

## Hook Usage Guidelines

### When to Use Standard React Hooks

**Use `useMemo` for:**
- Simple filtering operations
- Basic calculations
- Object/array transformations with few dependencies

**Use `useCallback` for:**
- Event handlers passed to child components
- Functions passed as props that cause re-renders
- Actual performance bottlenecks identified through profiling

### When to Use Optimized Hooks

**Use `useOptimizedMemo` only for:**
- Computationally expensive operations (>10ms)
- Complex data transformations
- Operations identified as bottlenecks through React DevTools Profiler

**Use `useOptimizedCallback` only for:**
- Callbacks passed to many child components (>10)
- Functions that trigger expensive re-renders
- Callbacks with complex logic or side effects

## Performance Best Practices

1. **Profile First**: Use React DevTools Profiler to identify actual bottlenecks
2. **Measure Impact**: Verify optimizations provide measurable benefit
3. **Keep It Simple**: Prefer standard React patterns unless optimization is necessary
4. **Monitor Bundle Size**: Avoid premature optimization that increases complexity

## Code Examples

### ❌ Over-optimized (Unnecessary)
```typescript
const filtered = useOptimizedMemo(
  () => items.filter(item => item.active),
  [items],
  { name: 'simple-filter' }
);
```

### ✅ Appropriately optimized
```typescript
const filtered = useMemo(
  () => items.filter(item => item.active),
  [items]
);
```

### ✅ When optimization makes sense
```typescript
const expensiveCalculation = useOptimizedMemo(
  () => performComplexDataTransformation(largeDataset),
  [largeDataset],
  { name: 'complex-transformation' }
);
```
