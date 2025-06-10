/**
 * Application Entry Point - Simplified Initialization
 * 
 * Minimal entry point with deferred heavy operations.
 */

// === EXTERNAL LIBRARIES ===
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// === COMPONENTS ===
import { logger } from '@/lib/logger';

import App from './App.tsx';
import { UnifiedErrorBoundary } from './components/ui/UnifiedErrorBoundary';

// === STYLES ===
import './index.css';

logger.info('Starting application...');

// Defer non-critical setup operations
Promise.resolve().then(async () => {
  // Setup error handling after initial render
  const { ErrorHandler } = await import('@/lib/core/ErrorHandler');
  ErrorHandler.setup();
  
  // Setup service worker if in production
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    const { setupServiceWorker } = await import('@/lib/utils/service-worker');
    setupServiceWorker();
  }
  
  // Optimize animations after initial render
  const { optimizeAnimations } = await import('@/lib/utils/core');
  optimizeAnimations();
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element with ID 'root' not found in the document.");
}

logger.info('Root element found, creating React app...');

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <UnifiedErrorBoundary variant="page" title="Application Error">
      <App />
    </UnifiedErrorBoundary>
  </StrictMode>
);

logger.info('React app created and rendered');
