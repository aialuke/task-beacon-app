/**
 * UI-specific utility functions
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with proper conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


/**
 * Checks if the device is in dark mode based on system preference
 */
export function isDarkMode(): boolean {
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

/**
 * Checks if dark theme is currently applied (based on CSS class)
 */
export function isDarkThemeActive(): boolean {
  return document.documentElement.classList.contains('dark');
}

/**
 * Gets the system dark mode media query for event listening
 */
export function getDarkModeMediaQuery(): MediaQueryList {
  return window.matchMedia('(prefers-color-scheme: dark)');
}
