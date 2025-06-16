/**
 * Consolidated Async Utilities
 *
 * Essential async operation patterns and utilities.
 * Simplified from nested directory structure.
 */

import { useState, useCallback } from 'react';

import { logger } from '../logger';

// ============================================================================
// TYPES
// ============================================================================

interface AsyncOperationOptions<T> {
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
  retries?: number;
  retryDelay?: number;
}

interface AsyncOperationResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  execute: () => Promise<void>;
  reset: () => void;
}

// ============================================================================
// ASYNC OPERATION HOOK
// ============================================================================

/**
 * Hook for managing async operations with loading states and error handling
 */
function useAsyncOperation<T>(
  operation: () => Promise<T>,
  options: AsyncOperationOptions<T> = {}
): AsyncOperationResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async () => {
    const { onSuccess, onError, retries = 0, retryDelay = 1000 } = options;

    setIsLoading(true);
    setError(null);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await operation();
        setData(result);
        setIsLoading(false);
        onSuccess?.(result);
        return;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        logger.warn('Async operation attempt failed', {
          attempt: attempt + 1,
          error: lastError.message,
        });

        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    setError(lastError);
    setIsLoading(false);
    if (lastError) {
      onError?.(lastError);
    }
  }, [operation, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, error, isLoading, execute, reset };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Simple retry wrapper for async functions
 */
async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  if (lastError) {
    throw lastError;
  } else {
    throw new Error('Unknown error in withRetry');
  }
}

/**
 * Execute multiple async operations in sequence
 */
async function executeInSequence<T>(
  operations: (() => Promise<T>)[]
): Promise<T[]> {
  const results: T[] = [];

  for (const operation of operations) {
    const result = await operation();
    results.push(result);
  }

  return results;
}

/**
 * Execute multiple async operations with limited concurrency
 */
async function executeWithConcurrency<T>(
  operations: (() => Promise<T>)[],
  concurrency = 3
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < operations.length; i += concurrency) {
    const batch = operations.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(op => op()));
    results.push(...batchResults);
  }

  return results;
}

// Note: debounce and throttle utilities are available from ./core

const _useAsyncOperation = useAsyncOperation;
const _withRetry = withRetry;
const _executeInSequence = executeInSequence;
const _executeWithConcurrency = executeWithConcurrency;
