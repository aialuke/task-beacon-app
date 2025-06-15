/**
 * Consolidated Async Utilities
 * 
 * Essential async operation patterns and utilities.
 * Simplified from nested directory structure.
 */

import { useState, useCallback } from 'react';

import type { StandardLoadingState } from '@/types/async-state.types';
import { createLoadingState } from '@/types/async-state.types';

import { logger } from '../logger';

// ============================================================================
// TYPES
// ============================================================================

export interface AsyncOperationOptions<T> {
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
  retries?: number;
  retryDelay?: number;
}

export interface AsyncOperationResult<T> extends StandardLoadingState {
  data: T | null;
  execute: () => Promise<void>;
  reset: () => void;
}

// ============================================================================
// ASYNC OPERATION HOOK
// ============================================================================

/**
 * Hook for managing async operations with standardized loading states and error handling
 */
export function useAsyncOperation<T>(
  operation: () => Promise<T>,
  options: AsyncOperationOptions<T> = {}
): AsyncOperationResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loadingState, setLoadingState] = useState<StandardLoadingState>(
    createLoadingState(false, false)
  );

  const execute = useCallback(async () => {
    const { onSuccess, onError, retries = 0, retryDelay = 1000 } = options;
    
    setLoadingState(createLoadingState(true, true));

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await operation();
        setData(result);
        setLoadingState(createLoadingState(false, false));
        onSuccess?.(result);
        return;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        logger.warn('Async operation attempt failed', { 
          attempt: attempt + 1, 
          error: lastError.message 
        });
        
        if (attempt < retries) {
          setLoadingState(createLoadingState(true, true, lastError));
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    setLoadingState(createLoadingState(false, false, lastError));
    if (lastError) {
      onError?.(lastError);
    }
  }, [operation, options]);

  const reset = useCallback(() => {
    setData(null);
    setLoadingState(createLoadingState(false, false));
  }, []);

  return { 
    data, 
    execute, 
    reset,
    ...loadingState
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Simple retry wrapper for async functions
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
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
  }
  
  // This should never happen, but provides a fallback
  throw new Error('Operation failed without error details');
}

/**
 * Execute multiple async operations in sequence
 */
export async function executeInSequence<T>(
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
export async function executeWithConcurrency<T>(
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

// Note: debounce and throttle utilities are available from core utilities 