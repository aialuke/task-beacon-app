
/**
 * Application Entry Point - Optimized Import Organization
 * 
 * Simplified entry point with better error handling.
 */

// === EXTERNAL LIBRARIES ===
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

// === COMPONENTS ===
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';

// === STYLES ===
import './index.css';

console.log('Starting application...');

// Setup basic error handlers
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element with ID 'root' not found in the document.");
}

console.log('Root element found, creating React app...');

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);

console.log('React app created and rendered');
