/**
 * Unified Animation System
 * 
 * Centralized animation configurations and utilities for consistent animations
 * across the Task Beacon app. Provides performance-optimized spring configs
 * with proper motion preference support.
 */

import { SpringConfig } from "@react-spring/web";

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