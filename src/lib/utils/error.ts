
/**
 * Error Utilities
 */

export function setupGlobalErrorHandlers() {
  // Handle unhandled errors
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });
}
// CodeRabbit review
// CodeRabbit review
