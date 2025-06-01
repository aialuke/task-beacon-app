/**
 * Animation utilities
 * 
 * Provides animation helpers, performance monitoring, and motion preference detection.
 * Migrated from src/lib/animationUtils.ts - use this path going forward.
 */

import { TaskStatus } from '@/types';
import { performanceLogger } from '../logger';

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
  baseDelay: number = 50,
  increment: number = 50
): string {
  return `${baseDelay + index * increment}ms`;
}

/**
 * Performance-optimized animation with GPU acceleration
 */
export function animateElement(
  element: HTMLElement | null,
  className: string,
  duration: number = 300,
  useGPU: boolean = true
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
  duration: number = 1000,
  respectMotionPreference: boolean = true
): Promise<void> {
  // Check motion preferences if requested
  if (respectMotionPreference && prefersReducedMotion()) {
    return Promise.resolve();
  }

  return animateElement(element, 'animate-pulse', duration);
}

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
 * Animation performance monitoring
 */
export function measureAnimationPerformance(animationName: string): () => void {
  const start = performance.now();
  
  performanceLogger.debug(`Animation started: ${animationName}`, { 
    startTime: start,
    animationName 
  });
  
  return () => {
    const end = performance.now();
    const duration = end - start;
    
    performanceLogger.debug(`Animation completed: ${animationName}`, {
      duration: `${duration.toFixed(2)}ms`,
      animationName,
      performance: duration > 16.67 ? 'poor' : 'good' // 60fps threshold
    });
  };
}

// Legacy export for backward compatibility
export const animationUtils = {
  calculateTimerOffset,
  setupAnimationVariables,
  getStaggeredDelay,
  animateElement,
  pulseElement,
  prefersReducedMotion,
  getSpringConfig,
  measureAnimationPerformance,
}; 