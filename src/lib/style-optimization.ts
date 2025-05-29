
/**
 * Style Optimization Patterns
 * 
 * This file documents the optimization patterns used to eliminate redundant
 * Tailwind and custom styles throughout the application.
 */

// Consolidated class patterns to replace repetitive usage
export const OPTIMIZED_PATTERNS = {
  // Focus states - use built-in Tailwind instead of custom utilities
  focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  
  // Card containers - consolidated pattern
  card: "bg-card/40 backdrop-blur-xl text-card-foreground rounded-3xl border border-border/30",
  
  // Button focus with ring
  buttonFocus: "focus-visible:outline-2 focus-visible:outline-primary focus-visible:ring-4 focus-visible:ring-primary/20",
  
  // Responsive sizing pattern
  responsiveSize: "w-14 h-14 sm:w-12 sm:h-12",
  
  // Positioning pattern for fixed elements
  fixedPosition: "fixed bottom-6 right-6 sm:bottom-4 sm:right-4",
} as const;

/**
 * Guidelines for style optimization:
 * 
 * 1. Use Tailwind's built-in focus-visible instead of custom focus utilities
 * 2. Consolidate repetitive class combinations into reusable patterns
 * 3. Remove custom utilities that duplicate Tailwind functionality
 * 4. Use responsive variants instead of separate media queries where possible
 * 5. Leverage Tailwind's shadow system instead of custom shadows
 * 6. Use design tokens through CSS variables for consistency
 */

export type OptimizedPattern = keyof typeof OPTIMIZED_PATTERNS;
