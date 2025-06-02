/**
 * Error Boundaries
 * 
 * Centralized exports for all error boundary components.
 * Provides both generic and feature-specific error handling.
 */

// Generic error boundaries
export { ErrorBoundary } from '@/components/ErrorBoundary';
export { DataErrorBoundary } from './DataErrorBoundary';

// Feature-specific error boundaries
export { TaskErrorBoundary } from '@/features/tasks/components/TaskErrorBoundary';
export { AuthErrorBoundary } from '@/features/auth/components/AuthErrorBoundary'; 