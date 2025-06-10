
/**
 * Application Entry Point - Optimized Import Organization
 * 
 * Simplified entry point with better error handling.
 */

// === EXTERNAL LIBRARIES ===
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// === COMPONENTS ===
import { logger } from '@/lib/logger';

import App from './App.tsx';
import UnifiedErrorBoundary from './components/ui/UnifiedErrorBoundary';

// === UTILITIES ===

// === STYLES ===
import './index.css';

logger.info('Starting application...');

// Setup basic error handlers
window.addEventListener('error', (event) => {
  logger.error('Global error', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection', new Error(String(event.reason)));
});

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
