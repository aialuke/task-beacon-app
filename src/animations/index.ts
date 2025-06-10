/**
 * Simplified Animation System - Minimal Complexity
 * 
 * Provides basic animation utilities without over-engineering
 */

import type { TaskStatus } from '@/types';

// Basic spring configuration for react-spring
export interface SpringConfig {
  tension: number;
  friction: number;
}

// Simple animation presets
export const ANIMATION_PRESETS = {
  gentle: { tension: 150, friction: 40 },
  snappy: { tension: 190, friction: 35 }, // User's preferred setting
  quick: { tension: 280, friction: 60 },
  disabled: { tension: 1000, friction: 100 }
} as const;

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get appropriate spring configuration based on motion preference
 */
export function getSpringConfig(preset: keyof typeof ANIMATION_PRESETS = 'snappy'): SpringConfig {
  if (prefersReducedMotion()) {
    return ANIMATION_PRESETS.disabled;
  }
  return ANIMATION_PRESETS[preset];
}

/**
 * Task card animation hook
 */
export function useTaskCardAnimation() {
  return getSpringConfig('snappy');
}

/**
 * Simple staggered delay for lists
 */
export function getStaggeredDelay(index: number, baseDelay = 50): string {
  return `${baseDelay + index * 50}ms`;
}

/**
 * Simple pulse animation (minimal implementation)
 */
export function pulseElement(): Promise<void> {
  // No-op for simplified system - just return resolved promise
  return Promise.resolve();
}

/**
 * Calculate timer offset for progress rings
 */
export function calculateTimerOffset(
  circumference: number,
  daysLeft: number,
  status: TaskStatus,
  dueDate: string | null
): number {
  if (status === 'complete') return 0;
  if (status === 'overdue') return 0;
  if (!dueDate) return circumference;

  const totalDays = 14;
  const remainingPercentage = Math.min(Math.max(daysLeft / totalDays, 0), 1);
  return circumference * (1 - remainingPercentage);
}

/**
 * Simplified setup animation variables (minimal implementation)
 */
export function setupAnimationVariables(): void {
  // No-op for simplified system
}

// Legacy exports for compatibility (deprecated)
export const animationUtils = {
  prefersReducedMotion,
  getSpringConfig,
};

export const AnimationPresets = ANIMATION_PRESETS; 