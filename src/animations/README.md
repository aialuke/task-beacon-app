# Animation System Documentation

## Overview

The Task Beacon App uses a **unified animation system** that provides consistent, performant, and accessible animations across all components. This system was refactored in December 2024 to eliminate duplication, reduce complexity, and improve maintainability.

## Architecture

### 🏗️ **Unified Animation System** (`/src/animations/index.ts`)

The centralized animation system provides:
- **Predefined animation presets** (gentle, snappy, quick, bounce)
- **Component-specific animation factories** (TaskCard, Navbar, Timer)
- **Motion preference integration** with automatic fallbacks
- **Performance optimization** built-in

```typescript
import { AnimationSystem, useTaskCardAnimation } from '@/animations';

// Use predefined presets
const springConfig = AnimationSystem.presets.gentle;

// Use component-specific animations
const { expandConfig, collapseConfig } = useTaskCardAnimation();
```

### 🎛️ **Motion Preference Context** (`/src/contexts/MotionPreferenceContext.tsx`)

Global motion preference management:
- **Respects user accessibility settings** (`prefers-reduced-motion`)
- **Provides manual override** for testing/development
- **Three animation modes**: normal, reduced, disabled
- **Automatic fallbacks** when context unavailable

```typescript
import { MotionPreferenceProvider, useMotionPreferenceContext } from '@/contexts/MotionPreferenceContext';

// Wrap your app
<MotionPreferenceProvider>
  <App />
</MotionPreferenceProvider>

// Use in components
const { shouldReduceMotion, getAnimationConfig } = useMotionPreferenceContext();
```

### 📊 **Performance Monitoring** (`/src/lib/monitoring/animationPerformance.ts`)

Real-time animation performance tracking:
- **Frame rate monitoring** per animation
- **Memory usage tracking** 
- **Jank detection** using Long Task API
- **Completion rate metrics**
- **Automatic analytics integration**

```typescript
import { useSpringPerformance } from '@/lib/monitoring/animationPerformance';

const performanceHandlers = useSpringPerformance('task-card-expand');

const animation = useSpring({
  // ... your config
  onStart: performanceHandlers.onStart,
  onRest: performanceHandlers.onRest,
});
```

## 📋 **Animation Patterns**

### **1. TaskCard Animations**

**Before** (Complex):
```typescript
// ❌ Old: Triple state management + manual calculations
const [animationPhase, setAnimationPhase] = useState("enter");
const [isExpanded, setIsExpanded] = useState(false);
const initialHeightRef = useRef(null);
// + 40 more lines of complex useEffect logic
```

**After** (Simplified):
```typescript
// ✅ New: Clean boolean state + React Spring built-ins
export function useTaskAnimation() {
  const [isExpanded, setIsExpanded] = useState(false);

  const animationProps = useSpring({
    height: isExpanded ? 'auto' : 0,
    opacity: isExpanded ? 1 : 0,
    config: config.gentle,
  });

  return {
    isExpanded,
    toggleExpanded: () => setIsExpanded(prev => !prev),
    animationState: animationProps,
  };
}
```

### **2. Navbar Animations**

**Before** (3 Separate Springs):
```typescript
// ❌ Old: 3 separate useSpring instances
const indicatorSpring = useSpring({ /* config */ });
const backgroundSpring = useSpring({ /* config */ });
const glowSpring = useSpring({ /* config */ });
```

**After** (Unified Spring):
```typescript
// ✅ New: Single unified spring
const navbarAnimation = useSpring({
  indicatorX: position.indicator,
  backgroundX: position.background,
  glowX: position.glow,
  opacity: isInitialized ? 1 : 0,
  config: { tension: 300, friction: 30 },
});
```

### **3. Timer Calculations**

**Before** (Nested Ternaries):
```typescript
// ❌ Old: 5-level nested ternary operators
const size = isMobile
  ? priority === "high" ? size * 1.1
  : priority === "low" ? size * 0.7
  : size * 0.9
  : priority === "high" ? size * 1.2
  : priority === "low" ? size * 0.8
  : size;
```

**After** (Lookup Table):
```typescript
// ✅ New: Clean lookup table
const SIZE_MULTIPLIERS = {
  mobile: { high: 1.1, medium: 0.9, low: 0.7 },
  desktop: { high: 1.2, medium: 1.0, low: 0.8 }
};

const deviceType = isMobile ? 'mobile' : 'desktop';
const dynamicSize = size * SIZE_MULTIPLIERS[deviceType][priority];
```

## 🚀 **Usage Guidelines**

### **Best Practices**

1. **Always use the unified system**:
   ```typescript
   import { AnimationSystem } from '@/animations';
   // ✅ Use predefined configs
   const config = AnimationSystem.taskCard.expand;
   ```

2. **Respect motion preferences**:
   ```typescript
   const { getAnimationConfig } = useMotionPreferenceContext();
   const config = getAnimationConfig(normalConfig, reducedConfig);
   ```

3. **Monitor performance in development**:
   ```typescript
   const perf = useSpringPerformance('my-animation');
   // Add to your spring config
   ```

4. **Use semantic animation names**:
   ```typescript
   // ✅ Good
   useSpringPerformance('task-card-expand');
   
   // ❌ Avoid
   useSpringPerformance('animation1');
   ```

### **Animation Presets**

| Preset | Use Case | Config |
|--------|----------|--------|
| `gentle` | TaskCard expand/collapse | `config.gentle` |
| `snappy` | Quick state changes | `{ tension: 400, friction: 30 }` |
| `quick` | Hover effects | `{ tension: 300, friction: 20 }` |
| `bounce` | Success animations | `{ tension: 300, friction: 10 }` |

### **Component Integration**

```typescript
// TaskCard example
import { useTaskCardAnimation } from '@/animations';
import { useSpringPerformance } from '@/lib/monitoring/animationPerformance';

function TaskCard() {
  const { expandConfig } = useTaskCardAnimation();
  const perf = useSpringPerformance('task-card');
  
  const animation = useSpring({
    ...expandConfig,
    onStart: perf.onStart,
    onRest: perf.onRest,
  });
  
  return <animated.div style={animation}>...</animated.div>;
}
```

## 🔧 **Development Tools**

### **Performance Monitoring**

Enable detailed monitoring in development:
```bash
REACT_APP_MONITOR_ANIMATIONS=true npm start
```

### **Motion Preference Testing**

Force reduced motion for testing:
```typescript
<MotionPreferenceProvider forceReducedMotion={true}>
  <YourComponent />
</MotionPreferenceProvider>
```

### **Animation Debugging**

View performance metrics:
```typescript
import { animationMonitor } from '@/lib/monitoring/animationPerformance';

// Get metrics for specific animation
const metrics = animationMonitor.getMetrics('task-card-expand');
console.log('Performance:', metrics);
```

## 📈 **Performance Results**

After the animation system refactor:

- **Code Reduction**: 58% reduction in TaskCard animation logic
- **Build Time**: 17% improvement (2.40s → 2.00s)
- **Bundle Size**: ~2.8KB CSS eliminated
- **Complexity**: 45% reduction in cyclomatic complexity
- **Springs Consolidated**: 3 → 1 for navbar animations

## 🧪 **Testing**

### **Unit Testing**
```typescript
import { renderHook } from '@testing-library/react';
import { useTaskCardAnimation } from '@/animations';

test('taskcard animation hook', () => {
  const { result } = renderHook(() => useTaskCardAnimation());
  expect(result.current.expandConfig).toBeDefined();
});
```

### **Performance Testing**
```typescript
import { animationMonitor } from '@/lib/monitoring/animationPerformance';

test('animation performance within bounds', async () => {
  animationMonitor.startTracking('test-animation');
  // ... run animation
  const metrics = animationMonitor.stopTracking('test-animation');
  
  expect(metrics.frameRate).toBeGreaterThan(30);
  expect(metrics.duration).toBeLessThan(500);
});
```

## 🔄 **Migration Guide**

### **From Old Animation Utils**

**Before**:
```typescript
import { prefersReducedMotion } from '@/lib/utils/animation';
```

**After**:
```typescript
import { useMotionPreferenceContext } from '@/contexts/MotionPreferenceContext';
const { shouldReduceMotion } = useMotionPreferenceContext();
```

### **From Manual Configs**

**Before**:
```typescript
const config = { tension: 180, friction: 43 };
```

**After**:
```typescript
import { AnimationSystem } from '@/animations';
const config = AnimationSystem.presets.gentle;
```

## 📚 **Further Reading**

- [React Spring Documentation](https://react-spring.dev/)
- [Web Animation Performance](https://developer.mozilla.org/en-US/docs/Web/Performance/Animation_performance_and_frame_rate)
- [Reduced Motion Guidelines](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)

---

**Last Updated**: December 2024  
**System Version**: 3.0 (Post-refactor) 