/**
 * Navigation utilities
 * 
 * Provides utilities for navigation menu variants and related functionality.
 * Consolidating scattered navigation utilities - use this path going forward.
 */

import { cva, type VariantProps } from "class-variance-authority";

/**
 * Navigation menu variants for consistent styling
 */
export const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
);

/**
 * Navigation menu content variants
 */
export const navigationMenuContentStyle = cva(
  "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto"
);

/**
 * Navigation menu link variants
 */
export const navigationMenuLinkStyle = cva(
  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
  {
    variants: {
      size: {
        default: "p-3",
        sm: "p-2",
        lg: "p-4",
      },
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-transparent",
        outline: "border border-input hover:bg-accent",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

/**
 * Get navigation classes for different states
 */
export function getNavigationClasses(props?: VariantProps<typeof navigationMenuLinkStyle>) {
  return navigationMenuLinkStyle(props);
}

/**
 * Check if a path is active based on current pathname
 */
export function isActiveRoute(currentPath: string, targetPath: string): boolean {
  if (targetPath === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(targetPath);
}

/**
 * Get active navigation item class
 */
export function getActiveNavigationClass(
  currentPath: string, 
  targetPath: string, 
  activeClass: string = 'bg-accent text-accent-foreground'
): string {
  return isActiveRoute(currentPath, targetPath) ? activeClass : '';
}

/**
 * Format breadcrumb from path
 */
export function formatBreadcrumb(path: string): string[] {
  return path
    .split('/')
    .filter(Boolean)
    .map(segment => 
      segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );
}

/**
 * Generate navigation URL with query parameters
 */
export function generateNavUrl(
  basePath: string, 
  params?: Record<string, string | number | boolean>
): string {
  if (!params) return basePath;
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, String(value));
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

/**
 * Parse navigation parameters from current URL
 */
export function parseNavParams(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
}

// Legacy export for backward compatibility
export const navigationUtils = {
  navigationMenuTriggerStyle,
  navigationMenuContentStyle,
  navigationMenuLinkStyle,
  getNavigationClasses,
  isActiveRoute,
  getActiveNavigationClass,
  formatBreadcrumb,
  generateNavUrl,
  parseNavParams,
};

// Re-export variant props type
export type NavigationMenuLinkProps = VariantProps<typeof navigationMenuLinkStyle>; 