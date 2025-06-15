/**
 * Unified Animation System
 * 
 * Centralized animation configurations and utilities for consistent animations
 * across the Task Beacon app. Provides performance-optimized spring configs
 * with proper motion preference support.
 * 
 * MIGRATION NOTE: This file consolidates all animation functionality.
 * The old `/lib/utils/animation.ts` system has been removed to eliminate
 * circular dependencies and provide a single source of truth for animations.
 */

import { SpringConfig } from "@react-spring/web";

import { TaskStatus } from '@/types';

// Animation presets optimized for different use cases
export const AnimationPresets = {
  // Gentle animations for general UI elements
  gentle: {
    tension: 120,
    friction: 40,
  } as SpringConfig,

  // Snappy animations for task cards (user's preferred settings)
  snappy: {
    tension: 190,
    friction: 35,
  } as SpringConfig,

  // Quick animations for hover effects
  quick: {
    tension: 300,
    friction: 20,
  } as SpringConfig,

  // Bounce animations for success states
  bounce: {
    tension: 300,
    friction: 10,
  } as SpringConfig,

  // Reduced motion alternatives (accessibility)
  reduced: {
    tension: 500,
    friction: 50,
  } as SpringConfig,
} as const;

// Component-specific animation configurations
export const ComponentAnimations = {
  taskCard: {
    expand: AnimationPresets.snappy,
    collapse: AnimationPresets.snappy,
    hover: AnimationPresets.quick,
  },
  navbar: {
    transition: {
      tension: 300,
      friction: 30,
    } as SpringConfig,
  },
  timer: {
    update: AnimationPresets.gentle,
  },
  modal: {
    enter: AnimationPresets.gentle,
    exit: AnimationPresets.quick,
  },
} as const;

// Main animation system export
export const AnimationSystem = {
  presets: AnimationPresets,
  components: ComponentAnimations,
  
  // Utility to get config based on motion preference
  getConfig: (
    normalConfig: SpringConfig,
    reducedConfig: SpringConfig = AnimationPresets.reduced,
    shouldReduce: boolean = false
  ): SpringConfig => {
    return shouldReduce ? reducedConfig : normalConfig;
  },
} as const;

// Hook-specific exports for easy component integration
export function useTaskCardAnimation() {
  return {
    expandConfig: ComponentAnimations.taskCard.expand,
    collapseConfig: ComponentAnimations.taskCard.collapse,
    hoverConfig: ComponentAnimations.taskCard.hover,
  };
}

export function useNavbarAnimation() {
  return {
    transitionConfig: ComponentAnimations.navbar.transition,
  };
}

export function useTimerAnimation() {
  return {
    updateConfig: ComponentAnimations.timer.update,
  };
}

export function useModalAnimation() {
  return {
    enterConfig: ComponentAnimations.modal.enter,
    exitConfig: ComponentAnimations.modal.exit,
  };
}

// Export individual presets for direct usage
export const {
  gentle,
  snappy,
  quick,
  bounce,
  reduced,
} = AnimationPresets;

// ============================================================================
// UTILITY FUNCTIONS (Migrated from old animation system)
// ============================================================================

/**
 * Determines if reduced motion is preferred by the user
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Creates optimized spring animation config based on motion preferences
 */
export function getSpringConfig(
  normalConfig: { tension: number; friction: number },
  reducedConfig: { tension: number; friction: number } = {
    tension: 500,
    friction: 50,
  }
) {
  return prefersReducedMotion() ? reducedConfig : normalConfig;
}

/**
 * Calculate the offset for the timer ring based on days left and status
 */
export function calculateTimerOffset(
  circumference: number,
  daysLeft: number,
  status: TaskStatus,
  dueDate: string | null
): number {
  if (status === 'complete') return 0;
  if (status === 'overdue') return 0;
  if (!dueDate) return circumference; // No due date, empty ring

  const totalDays = 14;
  const remainingPercentage = Math.min(Math.max(daysLeft / totalDays, 0), 1);
  return circumference * (1 - remainingPercentage);
}

/**
 * Helper function to set up CSS variables for animations with GPU acceleration
 */
export function setupAnimationVariables(
  element: HTMLElement | null,
  options: {
    circumference?: number;
    targetOffset?: number;
    duration?: string;
    enableGPU?: boolean;
  }
) {
  if (!element) return;

  if (options.circumference !== undefined) {
    element.style.setProperty(
      '--full-circumference',
      options.circumference.toString()
    );
  }

  if (options.targetOffset !== undefined) {
    element.style.setProperty(
      '--target-offset',
      options.targetOffset.toString()
    );
  }

  if (options.duration) {
    element.style.setProperty('--animation-duration', options.duration);
  }

  // Enable GPU acceleration for better performance
  if (options.enableGPU) {
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform, opacity';
  }
}

/**
 * Creates a staggered animation delay for list items
 */
export function getStaggeredDelay(
  index: number,
  baseDelay = 50,
  increment = 50
): string {
  return `${baseDelay + index * increment}ms`;
}

/**
 * Performance-optimized animation with GPU acceleration
 */
export function animateElement(
  element: HTMLElement | null,
  className: string,
  duration = 300,
  useGPU = true
): Promise<void> {
  if (!element) return Promise.resolve();

  return new Promise((resolve) => {
    // Enable GPU acceleration if requested
    if (useGPU) {
      element.style.transform = 'translateZ(0)';
      element.style.willChange = 'transform, opacity';
    }

    element.classList.add(className);

    setTimeout(() => {
      element.classList.remove(className);

      // Clean up GPU acceleration
      if (useGPU) {
        element.style.willChange = 'auto';
      }

      resolve();
    }, duration);
  });
}

/**
 * Applies a pulse animation to an element with motion preference awareness
 */
export function pulseElement(
  element: HTMLElement | null,
  duration = 1000,
  respectMotionPreference = true
): Promise<void> {
  // Check motion preferences if requested
  if (respectMotionPreference && prefersReducedMotion()) {
    return Promise.resolve();
  }

  return animateElement(element, 'animate-pulse', duration);
}

// ============================================================================
// LEGACY COMPATIBILITY (For gradual migration)
// ============================================================================

/**
 * @deprecated Use individual exports instead. This will be removed in a future version.
 */
export const animationUtils = {
  calculateTimerOffset,
  setupAnimationVariables,
  getStaggeredDelay,
  animateElement,
  pulseElement,
  prefersReducedMotion,
  getSpringConfig,
}; 