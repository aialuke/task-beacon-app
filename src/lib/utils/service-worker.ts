/**
 * Service Worker Utilities
 * 
 * Handles service worker registration and lifecycle management
 */

import { logger } from '@/lib/logger';

/**
 * Setup service worker for caching and performance
 */
export async function setupServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    logger.info('Service Worker registered successfully:', { scope: registration.scope });
    
    // Listen for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available, refresh page
            logger.info('New content available, refreshing page...');
            window.location.reload();
          }
        });
      }
    });
  } catch (error) {
    logger.warn('Service Worker registration failed:', error);
  }
} 