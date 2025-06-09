import { useSpring, config } from '@react-spring/web';
import { useMotionPreferences } from '@/hooks/useMotionPreferences';

// ===== ANIMATION PRESETS =====
export const AnimationPresets = {
  gentle: config.gentle,
  snappy: { tension: 400, friction: 30 },
  quick: { tension: 300, friction: 20 },
  bounce: { tension: 300, friction: 10 },
} as const;

// ===== COMPONENT-SPECIFIC ANIMATION FACTORIES =====

/**
 * Creates standardized TaskCard animations
 */
export function createTaskCardAnimations() {
  const { getAnimationConfig } = useMotionPreferences();
  
  return {
    expand: getAnimationConfig(AnimationPresets.gentle, { immediate: true }),
    collapse: getAnimationConfig(AnimationPresets.snappy, { immediate: true }),
    hover: getAnimationConfig(AnimationPresets.quick, { immediate: true }),
  };
}

/**
 * Creates standardized Navbar animations
 */
export function createNavbarAnimations() {
  const { getAnimationConfig } = useMotionPreferences();
  
  return {
    indicator: getAnimationConfig(
      { tension: 300, friction: 30 },
      { immediate: true }
    ),
    background: getAnimationConfig(
      { tension: 300, friction: 30 },
      { immediate: true }
    ),
    glow: getAnimationConfig(
      { tension: 250, friction: 35 },
      { immediate: true }
    ),
  };
}

/**
 * Creates standardized Timer animations
 */
export function createTimerAnimations() {
  const { getAnimationConfig } = useMotionPreferences();
  
  return {
    strokeProgress: getAnimationConfig(
      { tension: 120, friction: 14 },
      { immediate: true }
    ),
    scaleOnComplete: getAnimationConfig(
      { tension: 200, friction: 20 },
      { immediate: true }
    ),
  };
}

// ===== UNIFIED ANIMATION SYSTEM =====
export const AnimationSystem = {
  // Predefined animation sets
  taskCard: {
    expand: AnimationPresets.gentle,
    collapse: AnimationPresets.snappy,
    hover: AnimationPresets.quick,
  },
  
  navbar: {
    indicator: { tension: 300, friction: 30 },
    background: { tension: 300, friction: 30 },
    glow: { tension: 250, friction: 35 },
  },
  
  timer: {
    strokeProgress: { tension: 120, friction: 14 },
    scaleOnComplete: { tension: 200, friction: 20 },
  },
  
  // Component-specific animation factories
  createTaskCardAnimations,
  createNavbarAnimations, 
  createTimerAnimations,
  
  // Global settings
  respectMotionPreferences: true,
  performanceMode: 'auto' as const, // auto, high, low
  
  // Animation utilities
  presets: AnimationPresets,
} as const;

// ===== CONVENIENCE HOOKS =====

/**
 * Hook for TaskCard animations with motion preferences
 */
export function useTaskCardAnimation() {
  const animations = createTaskCardAnimations();
  return {
    expandConfig: animations.expand,
    collapseConfig: animations.collapse,
    hoverConfig: animations.hover,
  };
}

/**
 * Hook for Navbar animations with motion preferences
 */
export function useNavbarAnimation() {
  const animations = createNavbarAnimations();
  return {
    indicatorConfig: animations.indicator,
    backgroundConfig: animations.background,
    glowConfig: animations.glow,
  };
}

/**
 * Hook for Timer animations with motion preferences  
 */
export function useTimerAnimation() {
  const animations = createTimerAnimations();
  return {
    strokeConfig: animations.strokeProgress,
    scaleConfig: animations.scaleOnComplete,
  };
}

export default AnimationSystem; 