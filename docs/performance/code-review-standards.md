# Performance Code Review Standards

## Performance Review Checklist

### Pre-Review Requirements

Before submitting code with performance optimizations, developers must provide:

1. **Profiling Evidence**

   - Screenshots or data from React DevTools Profiler
   - Benchmark results showing performance improvement
   - Comparison of before/after metrics

2. **Justification Document**
   - Why standard React patterns were insufficient
   - Expected performance gain
   - Bundle size impact analysis

### Review Criteria

#### Automatic Approval ✅

- Standard React hooks (`useMemo`, `useCallback`, `memo`)
- Optimizations with >20% performance improvement
- Operations taking >10ms that are optimized to <5ms

#### Requires Discussion 🤔

- Custom performance hooks without clear justification
- Optimizations with <10% performance improvement
- Complex abstractions for simple operations

#### Automatic Rejection ❌

- Custom hooks without profiling data
- Optimizations for operations <5ms
- Performance hooks used for code organization (not performance)

## Performance Hook Usage Standards

### Standard React Hooks - Always Preferred

```typescript
// ✅ GOOD: Standard React for simple operations
const memoizedValue = useMemo(() => computeValue(props), [props]);
const memoizedCallback = useCallback(() => handleClick(), [dependency]);
const MemoizedComponent = memo(Component);
```

### Custom Performance Hooks - Requires Justification

```typescript
// ⚠️ REQUIRES JUSTIFICATION: Must provide profiling data
const optimizedValue = useOptimizedMemo(
  () => expensiveComputation(data), // Must be >10ms
  [data],
  { name: 'expensive-computation' }
);
```

## Common Anti-Patterns

### ❌ Over-Optimization Red Flags

1. **Premature Optimization**

   ```typescript
   // BAD: No evidence this needs optimization
   const simple = useOptimizedMemo(() => a + b, [a, b]);
   ```

2. **Cargo Cult Programming**

   ```typescript
   // BAD: Copying patterns without understanding
   const everything = useOptimizedCallback(() => setState(value), [value]);
   ```

3. **Abstraction for Abstraction's Sake**
   ```typescript
   // BAD: Unnecessary wrapper
   const useMemoizedState = initial => useOptimizedMemo(() => initial, []);
   ```

## Performance Testing Requirements

### Minimum Testing Standards

1. **Component Render Performance**

   - Test with 100, 1000, and 10000 items
   - Measure render time consistency
   - Verify no performance regression

2. **Memory Usage**

   - Check for memory leaks
   - Monitor memory growth patterns
   - Test cleanup on unmount

3. **Bundle Size Impact**
   - Measure bundle size change
   - Analyze tree-shaking effectiveness
   - Document size vs. performance trade-offs

## Documentation Standards

### Required Performance Comments

```typescript
/**
 * PERFORMANCE OPTIMIZATION
 *
 * Issue: Component re-rendering 50+ times per second during scroll
 * Profiling: Before: 45ms avg render, After: 8ms avg render
 * Improvement: 82% reduction in render time
 * Date: 2024-12-08
 * Next Review: 2025-03-08
 *
 * @param {Function} expensiveOperation - Complex data transformation
 * @param {Array} dependencies - Dependencies for memoization
 */
const optimizedResult = useOptimizedMemo(expensiveOperation, dependencies);
```

## Performance Debt Management

### Regular Reviews

- **Monthly**: Review all custom performance hooks
- **Quarterly**: Profile critical user flows
- **Annually**: Audit entire performance optimization strategy

### Deprecation Process

1. Identify unnecessary optimizations
2. Create migration plan to standard hooks
3. Update documentation
4. Remove custom optimizations
5. Monitor for regression

## Team Training Requirements

### For All Developers

- [ ] Complete React Performance workshop
- [ ] Understand profiling tools
- [ ] Practice optimization decision-making

### For Senior Developers

- [ ] Performance code review certification
- [ ] Mentoring on optimization decisions
- [ ] Architecture performance impact assessment

---

**Golden Rule**: Every performance optimization must be justified with data, not assumptions.
