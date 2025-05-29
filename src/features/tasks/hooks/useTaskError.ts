import { useCallback } from 'react';
import { handleApiError, ErrorHandlingOptions } from '@/lib/errorHandling';
import { TaskError } from '../types/task-api.types';

/**
 * Hook for standardized task-specific error handling
 */
export function useTaskError() {
  /**
   * Handle task operation errors
   *
   * @param error - The error that occurred
   * @param operation - Name of the operation that failed (e.g., 'create', 'update')
   * @param options - Error handling options
   */
  const handleTaskError = useCallback(
    (
      error: Error | TaskError | unknown,
      operation: string,
      options?: ErrorHandlingOptions
    ) => {
      const operationMap: Record<string, string> = {
        create: 'creating',
        update: 'updating',
        delete: 'deleting',
        fetch: 'fetching',
        complete: 'completing',
        pin: 'pinning/unpinning',
        followUp: 'creating follow-up for',
      };

      const actionName = operationMap[operation] || operation;
      const customMessage = `Error ${actionName} task`;

      return handleApiError(error, customMessage, options);
    },
    []
  );

  return { handleTaskError };
}
