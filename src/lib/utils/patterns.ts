/**
 * Common patterns and utilities
 */

export type AsyncFunc<T> = (...args: any[]) => Promise<T>;

export const executeAsync = async <T>(
  asyncFn: AsyncFunc<T>,
  ...args: any[]
): Promise<T | null> => {
  try {
    const result = await asyncFn(...args);
    return result;
  } catch (error) {
    console.error("Async function execution failed:", error);
    return null;
  }
};

export const retryAsync = async <T>(
  asyncFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await asyncFn();
    } catch (error) {
      attempt++;
      console.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
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
      console.error(errorMessage, error);
      throw error;
    }
  };
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number = 300
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
// CodeRabbit review
