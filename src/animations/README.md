# Animation System Documentation

## Overview

The Task Beacon App uses a **performance-optimized animation system** built with React Spring that
provides consistent, accessible animations across all components. The system emphasizes simplicity
and performance while respecting user accessibility preferences.

## Architecture

### 🎛️ **Motion Preference Integration**

The application respects user accessibility settings:

- **Automatic detection** of `prefers-reduced-motion` CSS media query
- **Graceful fallbacks** for reduced motion preferences
- **Consistent animation behavior** across all components

```typescript
import { useMotionPreferences } from '@/hooks/useMotionPreferences';

const { prefersReducedMotion } = useMotionPreferences();
const config = prefersReducedMotion ? config.gentle : config.default;
```

### 📊 **Performance-First Approach**

All animations are designed with performance in mind:

- **GPU acceleration** for transform and opacity changes
- **Minimal layout thrashing** by avoiding width/height animations where possible
- **Efficient spring configurations** optimized for 60fps performance
- **Conditional rendering** to avoid unnecessary animation calculations

## 📋 **Animation Patterns**

### **1. TaskCard Animations**

Clean expand/collapse animations using React Spring:

```typescript
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

### **2. Timer Animations**

Smooth countdown timer animations with performance optimization:

```typescript
const timerAnimation = useSpring({
  progress: timeRemaining / totalTime,
  config: { tension: 280, friction: 60 },
});
```

### **3. Navigation Animations**

Responsive navigation indicator animations:

```typescript
const navbarAnimation = useSpring({
  transform: `translateX(${position}px)`,
  config: { tension: 300, friction: 30 },
});
```

## 🚀 **Usage Guidelines**

### **Best Practices**

1. **Use semantic animation configurations**:

   ```typescript
   // ✅ Good - semantic naming
   const config = config.gentle; // For subtle UI changes
   const config = config.wobbly; // For playful interactions
   ```

2. **Respect motion preferences**:

   ```typescript
   const { prefersReducedMotion } = useMotionPreferences();
   const animationConfig = prefersReducedMotion ? { duration: 0 } : config.default;
   ```

3. **Optimize for performance**:

   ```typescript
   // ✅ Prefer transform and opacity
   const animation = useSpring({
     transform: `scale(${isActive ? 1.05 : 1})`,
     opacity: isVisible ? 1 : 0,
   });

   // ❌ Avoid layout-triggering properties
   const animation = useSpring({
     width: isExpanded ? 300 : 100, // Causes layout recalculation
   });
   ```

4. **Use appropriate spring configurations**:

   ```typescript
   // For quick UI feedback
   const quickConfig = { tension: 400, friction: 30 };

   // For smooth, gentle transitions
   const gentleConfig = { tension: 280, friction: 60 };

   // For bouncy, playful animations
   const bouncyConfig = { tension: 300, friction: 10 };
   ```

### **Animation Presets**

| Use Case                | Configuration                    | Description                 |
| ----------------------- | -------------------------------- | --------------------------- |
| Quick state changes     | `{ tension: 400, friction: 30 }` | Snappy, responsive feedback |
| Smooth transitions      | `{ tension: 280, friction: 60 }` | Gentle, polished animations |
| Playful interactions    | `{ tension: 300, friction: 10 }` | Bouncy, engaging animations |
| Reduced motion fallback | `{ duration: 0 }`                | Instant state changes       |

### **Component Integration**

```typescript
import { useSpring, animated } from '@react-spring/web';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';

function AnimatedComponent() {
  const { prefersReducedMotion } = useMotionPreferences();

  const animation = useSpring({
    opacity: isVisible ? 1 : 0,
    transform: `translateY(${isVisible ? 0 : 20}px)`,
    config: prefersReducedMotion
      ? { duration: 0 }
      : { tension: 280, friction: 60 },
  });

  return (
    <animated.div style={animation}>
      {/* Component content */}
    </animated.div>
  );
}
```

## 🔧 **Development Guidelines**

### **Performance Considerations**

1. **Minimize animation complexity** - Keep spring calculations simple
2. **Use transform and opacity** - Avoid properties that trigger layout
3. **Implement proper cleanup** - Ensure animations don't leak memory
4. **Test on lower-end devices** - Verify performance across device spectrum

### **Accessibility Requirements**

1. **Always respect `prefers-reduced-motion`**
2. **Provide instant fallbacks** for users who need them
3. **Ensure animations don't interfere** with screen readers
4. **Test with accessibility tools** to verify compatibility

### **Testing Animations**

```typescript
// Test animation behavior
describe('TaskCard Animation', () => {
  it('should expand when clicked', async () => {
    const { getByTestId } = render(<TaskCard />);
    const card = getByTestId('task-card');

    fireEvent.click(card);

    // Wait for animation to complete
    await waitFor(() => {
      expect(card).toHaveStyle('opacity: 1');
    });
  });
});
```

## 📈 **Performance Monitoring**

### **Key Metrics**

- **Frame rate**: Target 60fps for all animations
- **Animation duration**: Keep under 300ms for UI feedback
- **Memory usage**: Monitor for animation-related memory leaks
- **CPU usage**: Ensure animations don't block main thread

### **Debugging Tools**

- React DevTools Profiler for component render performance
- Chrome DevTools Performance tab for frame rate analysis
- React Spring DevTools for spring debugging

---

**Remember**: Great animations enhance user experience without drawing attention to themselves.
Always prioritize performance and accessibility over visual complexity.
