/**
 * Application Entry Point - Optimized Import Organization
 * 
 * Simplified entry point with better error handling.
 */

// === EXTERNAL LIBRARIES ===
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// === COMPONENTS ===
import { ErrorHandler } from '@/lib/core/ErrorHandler';
import { logger } from '@/lib/logger';
import { optimizeAnimations } from '@/lib/utils/core';

import App from './App.tsx';
import { UnifiedErrorBoundary } from './components/ui/UnifiedErrorBoundary';

// === UTILITIES ===

// === STYLES ===
import './index.css';

logger.info('Starting application...');

// Setup unified error handling system
ErrorHandler.setup();

// Initialize animation optimizations based on user preferences
optimizeAnimations();

// Phase 3: Register Service Worker for caching and performance
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
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
      })
      .catch(error => {
        logger.warn('Service Worker registration failed:', error);
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element with ID 'root' not found in the document.");
}

logger.info('Root element found, creating React app...');

// Ensure React is properly available
if (!React) {
  throw new Error('React is not available');
}

logger.info('React version', { version: React.version });

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <UnifiedErrorBoundary variant="page" title="Application Error">
      <App />
    </UnifiedErrorBoundary>
  </StrictMode>
);

logger.info('React app created and rendered');
