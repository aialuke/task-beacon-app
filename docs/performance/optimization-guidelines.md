# Performance Optimization Guidelines

## Overview

This document establishes clear criteria for when to use performance optimizations versus standard
React patterns to prevent over-engineering.

## Core Principles

### 1. Profile First, Optimize Second

- **NEVER** optimize without profiling data
- Use React DevTools Profiler to identify actual bottlenecks
- Measure performance impact before and after optimizations
- Document performance metrics in code comments

### 2. Standard React First

- Always start with standard React hooks (`useMemo`, `useCallback`, `memo`)
- Only use custom performance hooks for proven bottlenecks
- Prefer readability and maintainability over premature optimization

## Decision Matrix

### When to Use Standard React Hooks

#### `useMemo` - Use for:

✅ Simple filtering operations (< 1000 items) ✅ Basic calculations and transformations ✅
Object/array creation with few dependencies ✅ Component props that change frequently

#### `useCallback` - Use for:

✅ Event handlers passed to child components ✅ Functions that prevent unnecessary re-renders ✅
Callbacks with stable dependencies

#### `memo` - Use for:

✅ Components that receive complex props ✅ Components that re-render frequently ✅ Leaf components
in component trees

### When to Use Custom Performance Hooks

#### `useOptimizedMemo` - ONLY for:

⚠️ Computationally expensive operations (>10ms execution time) ⚠️ Complex data transformations on
large datasets (>1000 items) ⚠️ Operations identified as bottlenecks through profiling

#### `useOptimizedCallback` - ONLY for:

⚠️ Callbacks passed to many child components (>10 children) ⚠️ Functions that trigger expensive
re-renders ⚠️ Callbacks with complex logic or side effects

## Code Review Checklist

### Before Approving Performance Optimizations

- [ ] Profiling data provided showing actual performance issue
- [ ] Benchmark results comparing before/after optimization
- [ ] Justification for custom hooks over standard React patterns
- [ ] Performance impact measured and documented
- [ ] Bundle size impact considered

### Red Flags in Code Review

❌ **Immediate Rejection Criteria:**

- Custom performance hooks without profiling data
- Optimizations for operations taking <5ms
- Complex abstractions for simple operations
- Performance hooks used for convenience rather than performance

## Examples

### ❌ Over-Engineered (Reject)

```typescript
// NO: Unnecessary optimization for simple operation
const filteredItems = useOptimizedMemo(() => items.filter(item => item.active), [items], {
  name: 'simple-filter',
});
```

### ✅ Appropriately Optimized

```typescript
// YES: Standard React for simple operations
const filteredItems = useMemo(() => items.filter(item => item.active), [items]);
```

### ✅ When Custom Optimization is Justified

```typescript
// YES: Complex operation with profiling data showing >10ms execution
const processedData = useOptimizedMemo(
  () => performComplexDataTransformation(largeDataset), // Profiled: 25ms avg
  [largeDataset],
  { name: 'complex-transformation' }
);
```

## Performance Budget

### Component Render Time

- **Target**: <16ms per component render
- **Warning**: >16ms (causes frame drops)
- **Critical**: >32ms (requires immediate optimization)

### Bundle Size Impact

- **Target**: <10KB addition per optimization
- **Warning**: >10KB (requires justification)
- **Critical**: >25KB (requires architectural review)

## Monitoring and Maintenance

### Regular Performance Audits

1. Monthly review of custom performance hooks
2. Quarterly profiling of critical components
3. Annual review of optimization guidelines

### Metrics to Track

- Component render times
- Bundle size growth
- Performance hook usage frequency
- Developer feedback on complexity

## Documentation Requirements

### For All Performance Optimizations

```typescript
/**
 * Performance Optimization: [Brief Description]
 *
 * Profiling Data:
 * - Before: XXms average execution time
 * - After: XXms average execution time
 * - Improvement: XX% reduction
 *
 * Justification: [Why standard React hooks were insufficient]
 * Date: [When optimization was added]
 * Review Date: [When to review if still needed]
 */
```

## Training and Onboarding

### For New Developers

1. Review this document
2. Complete performance profiling exercise
3. Code review with performance focus
4. Shadow experienced developer on optimization decisions

### Ongoing Education

- Monthly tech talks on performance best practices
- Quarterly training on React DevTools Profiler
- Annual review of performance patterns

## Escalation Process

### When Performance Issues Arise

1. **Step 1**: Profile with React DevTools
2. **Step 2**: Try standard React optimizations
3. **Step 3**: Consult with senior developer
4. **Step 4**: Document and implement custom optimization
5. **Step 5**: Schedule review in 3 months

## Tools and Resources

### Required Tools

- React DevTools Profiler
- Chrome DevTools Performance tab
- Lighthouse CI for automated testing

### Recommended Reading

- React documentation on performance
- Web Vitals guidelines
- Component optimization patterns

---

**Remember**: The best optimization is no optimization. Always prefer simple, readable code over
complex optimizations unless proven necessary through profiling.
