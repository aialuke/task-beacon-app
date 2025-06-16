/**
 * Common patterns and utilities
 */

import { logger } from '@/lib/logger';

type AsyncFunc<T, TArgs extends unknown[] = unknown[]> = (
  ...args: TArgs
) => Promise<T>;

const _executeAsync = async <T, TArgs extends unknown[]>(
  asyncFn: AsyncFunc<T, TArgs>,
  ...args: TArgs
): Promise<T | null> => {
  try {
    const result = await asyncFn(...args);
    return result;
  } catch (error) {
    logger.error(
      'Async function execution failed',
      error instanceof Error ? error : new Error(String(error))
    );
    return null;
  }
};

const _retryAsync = async <T>(
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
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error(`Async function failed after ${maxRetries} attempts`);
};

function createAsyncHandler<T = void>(
  handler: () => Promise<T>,
  errorMessage = 'Operation failed'
): () => Promise<T | void> {
  return async () => {
    try {
      return await handler();
    } catch (error) {
      logger.error(
        errorMessage,
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  };
}
