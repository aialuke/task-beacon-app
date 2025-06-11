# React Performance Profiling Guide

## Getting Started with React DevTools Profiler

### Installation

1. Install React DevTools browser extension
2. Open DevTools → Profiler tab
3. Ensure React app is in development mode

### Basic Profiling Workflow

#### Step 1: Record Performance

```typescript
// 1. Click "Record" in Profiler
// 2. Perform the action you want to measure
// 3. Click "Stop" to finish recording
```

#### Step 2: Analyze Results

- **Flamegraph**: Shows component render hierarchy and timing
- **Ranked**: Lists components by render time
- **Interactions**: Groups renders by user interactions

#### Step 3: Identify Bottlenecks

Look for:

- Components taking >16ms to render
- Frequent re-renders without prop changes
- Large component trees rendering unnecessarily

## Common Performance Issues

### 1. Unnecessary Re-renders

**Symptoms**: Components rendering without prop changes **Detection**: Look for components
highlighted in Profiler without actual changes **Solution**: Add `memo` wrapper or optimize parent
component

### 2. Expensive Computations

**Symptoms**: Single component taking >16ms **Detection**: Large flame in Profiler for single
component **Solution**: Use `useMemo` for expensive calculations

### 3. Inefficient Event Handlers

**Symptoms**: Many child components re-rendering on parent interaction **Detection**: Cascading
renders in flamegraph **Solution**: Use `useCallback` for stable event handlers

## Profiling Scenarios

### Scenario 1: List Performance

```typescript
// Profile large lists with different optimization strategies
const ProfiledTaskList = () => {
  // Before optimization - profile this
  const unoptimizedList = tasks.map(task => <TaskCard key={task.id} task={task} />);

  // After optimization - compare performance
  const optimizedList = useMemo(
    () => tasks.map(task => <TaskCard key={task.id} task={task} />),
    [tasks]
  );

  return <div>{optimizedList}</div>;
};
```

### Scenario 2: Form Performance

```typescript
// Profile form interactions and validation
const ProfiledForm = () => {
  const [formData, setFormData] = useState({});

  // Profile this expensive validation
  const validationErrors = useMemo(
    () => validateFormData(formData),
    [formData]
  );

  return <form>...</form>;
};
```

## Performance Benchmarking

### Manual Benchmarking

```typescript
// Wrap expensive operations with performance measurement
const measurePerformance = (name, fn) => {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`${name}: ${end - start}ms`);
  return result;
};

// Usage
const result = measurePerformance('data-processing', () => processLargeDataset(data));
```

### Automated Benchmarking

```typescript
// Create performance tests
describe('Component Performance', () => {
  it('should render 1000 items under 100ms', () => {
    const start = performance.now();
    render(<TaskList tasks={generateTasks(1000)} />);
    const end = performance.now();

    expect(end - start).toBeLessThan(100);
  });
});
```

## Performance Metrics

### Key Metrics to Track

1. **First Contentful Paint (FCP)**: <1.8s
2. **Largest Contentful Paint (LCP)**: <2.5s
3. **Cumulative Layout Shift (CLS)**: <0.1
4. **First Input Delay (FID)**: <100ms

### Component-Level Metrics

1. **Render Time**: <16ms per component
2. **Re-render Frequency**: <10 per user interaction
3. **Memory Usage**: Monitor for leaks
4. **Bundle Impact**: <10KB per optimization

## Profiling Best Practices

### Do's ✅

- Profile in development mode for detailed information
- Test with realistic data volumes
- Profile on different devices and browsers
- Document findings with screenshots
- Compare before/after metrics

### Don'ts ❌

- Don't profile in production builds only
- Don't optimize without measuring first
- Don't ignore memory usage
- Don't skip testing on mobile devices
- Don't assume optimizations work everywhere

## Common Profiling Mistakes

### 1. Testing with Minimal Data

```typescript
// BAD: Testing with 5 items
const testData = [1, 2, 3, 4, 5];

// GOOD: Testing with realistic data
const testData = generateRealisticDataset(1000);
```

### 2. Ignoring Network Conditions

```typescript
// Test under different conditions:
// - Fast 3G, Slow 3G, Offline
// - Use Chrome DevTools Network tab
```

### 3. Not Testing Edge Cases

```typescript
// Test performance with:
// - Empty datasets
// - Very large datasets
// - Rapidly changing data
// - Error states
```

## Performance Debugging Tools

### React DevTools Profiler

- Component render timing
- Re-render identification
- Props change tracking

### Chrome DevTools Performance

- JavaScript execution time
- Layout and paint timing
- Memory usage patterns

### Lighthouse

- Automated performance audits
- Core Web Vitals measurement
- Performance recommendations

## Creating Performance Reports

### Report Template

```markdown
# Performance Analysis Report

## Summary

- Component: [Component Name]
- Issue: [Performance Issue Description]
- Impact: [User Experience Impact]

## Measurements

- Before: XXms average render time
- After: XXms average render time
- Improvement: XX% reduction

## Evidence

[Screenshots from React DevTools Profiler]

## Solution

[Description of optimization applied]

## Verification

[How the fix was verified]
```

---

**Remember**: Profile first, optimize second. Never optimize without data.
