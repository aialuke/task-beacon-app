/**
 * Enhanced animation utility functions with performance optimizations
 *
 * This file contains utilities for animations and transitions throughout the app.
 */

import { TaskStatus } from '@/types';

// Calculate the offset for the timer ring based on days left and status
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

// Helper function to set up CSS variables for animations with GPU acceleration
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
 *
 * @param index - Index of the item in the list
 * @param baseDelay - Base delay in milliseconds
 * @param increment - Delay increment per item
 * @returns CSS animation delay value
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
 *
 * @param element - Element to animate
 * @param className - CSS class to apply
 * @param duration - Animation duration in milliseconds
 * @param useGPU - Whether to enable GPU acceleration
 * @returns Promise that resolves when animation is complete
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
 *
 * @param element - Element to animate
 * @param duration - Animation duration in milliseconds
 * @param respectMotionPreference - Whether to check motion preferences
 * @returns Promise that resolves when animation is complete
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
 *
 * @returns True if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Creates optimized spring animation config based on motion preferences
 *
 * @param normalConfig - Normal animation configuration
 * @param reducedConfig - Reduced motion configuration
 * @returns Appropriate configuration based on user preferences
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
 * Performance monitoring utility for animations
 *
 * @param animationName - Name of the animation for debugging
 * @param callback - Animation function to profile
 * @returns Result of the callback function
 */
export function profileAnimation<T>(
  animationName: string,
  callback: () => T
): T {
  if (process.env.NODE_ENV === 'development') {
    const start = performance.now();
    const result = callback();
    const end = performance.now();
    console.log(`🎬 Animation "${animationName}" took ${end - start}ms`);
    return result;
  }
  return callback();
}
