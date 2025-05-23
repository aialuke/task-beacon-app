
/**
 * Animation utility functions
 * 
 * This file contains utilities for animations and transitions throughout the app.
 */

// Calculate the offset for the timer ring based on days left and status
export function calculateTimerOffset(
  circumference: number,
  daysLeft: number,
  status: TaskStatus,
  dueDate: string | null
): number {
  if (status === "complete") return 0;
  if (status === "overdue") return 0;
  if (!dueDate) return circumference; // No due date, empty ring
  
  const totalDays = 14;
  const remainingPercentage = Math.min(Math.max(daysLeft / totalDays, 0), 1);
  return circumference * (1 - remainingPercentage);
}

// Helper function to set up CSS variables for animations
export function setupAnimationVariables(
  element: HTMLElement | null, 
  options: { 
    circumference?: number;
    targetOffset?: number;
    duration?: string;
  }
) {
  if (!element) return;
  
  if (options.circumference !== undefined) {
    element.style.setProperty('--full-circumference', options.circumference.toString());
  }
  
  if (options.targetOffset !== undefined) {
    element.style.setProperty('--target-offset', options.targetOffset.toString());
  }
  
  if (options.duration) {
    element.style.setProperty('--animation-duration', options.duration);
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
export function getStaggeredDelay(index: number, baseDelay: number = 50, increment: number = 50): string {
  return `${baseDelay + (index * increment)}ms`;
}

/**
 * Adds a CSS class to an element and removes it after animation completes
 * 
 * @param element - Element to animate
 * @param className - CSS class to apply
 * @param duration - Animation duration in milliseconds
 * @returns Promise that resolves when animation is complete
 */
export function animateElement(
  element: HTMLElement | null,
  className: string,
  duration: number = 300
): Promise<void> {
  if (!element) return Promise.resolve();
  
  return new Promise(resolve => {
    element.classList.add(className);
    
    setTimeout(() => {
      element.classList.remove(className);
      resolve();
    }, duration);
  });
}

/**
 * Applies a pulse animation to an element
 * 
 * @param element - Element to animate
 * @param duration - Animation duration in milliseconds
 * @returns Promise that resolves when animation is complete
 */
export function pulseElement(element: HTMLElement | null, duration: number = 1000): Promise<void> {
  return animateElement(element, 'animate-pulse', duration);
}

/**
 * Determines if reduced motion is preferred by the user
 * 
 * @returns True if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Import TaskStatus type for timer functions
import { TaskStatus } from "./types";

