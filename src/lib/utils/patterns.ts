/**
 * Common patterns and utilities
 */

import { logger } from '@/lib/logger';

export type AsyncFunc<T> = (...args: unknown[]) => Promise<T>;

export const executeAsync = async <T>(
  asyncFn: AsyncFunc<T>,
  ...args: unknown[]
): Promise<T | null> => {
  try {
    const result = await asyncFn(...args);
    return result;
  } catch (error) {
    logger.error("Async function execution failed", error instanceof Error ? error : new Error(String(error)));
    return null;
  }
};

export const retryAsync = async <T>(
  asyncFn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await asyncFn();
    } catch (_error) {
      attempt++;
      logger.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Async function failed after ${maxRetries} attempts`);
};

export function createAsyncHandler<T = void>(
  handler: () => Promise<T>,
  errorMessage = 'Operation failed'
): () => Promise<T | void> {
  return async () => {
    try {
      return await handler();
    } catch (error) {
      logger.error(errorMessage, error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  };
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait = 300
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit = 300
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
