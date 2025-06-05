
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';
import { setupGlobalErrorHandlers } from '@/lib/utils/error';
import { optimizeFontLoading, setupLazyLoading } from '@/lib/utils/asset-optimization';

// Setup global error handlers for unhandled errors and promise rejections
setupGlobalErrorHandlers();

// Apply performance optimizations
optimizeFontLoading();

// Setup lazy loading after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setupLazyLoading();
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element with ID 'root' not found in the document.");
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
