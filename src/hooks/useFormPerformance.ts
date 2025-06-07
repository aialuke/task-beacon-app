
import { useCallback, useMemo, useRef } from 'react';
import { debounce } from 'lodash-es';

interface FormPerformanceOptions {
  debounceMs?: number;
  enableOptimisticUpdates?: boolean;
  validateOnChange?: boolean;
}

interface OptimisticUpdate {
  value: unknown;
  timestamp: number;
}

/**
 * Form Performance Optimization Hook - Phase 4 Implementation
 * 
 * Provides performance optimizations for forms:
 * - Debounced validation
 * - Optimistic updates
 * - Reduced re-render cycles
 * - Memory leak prevention
 */
export function useFormPerformance<T extends Record<string, unknown>>(
  initialValues: T,
  options: FormPerformanceOptions = {}
) {
  const {
    debounceMs = 300,
    enableOptimisticUpdates = true,
    validateOnChange = true,
  } = options;

  const validationCacheRef = useRef(new Map<string, unknown>());
  const optimisticUpdatesRef = useRef(new Map<string, OptimisticUpdate>());

  // Debounced validation function
  const debouncedValidation = useMemo(
    () => debounce((fieldName: string, value: unknown, validator?: (value: any) => any) => {
      if (!validator || !validateOnChange) return;

      // Check cache first
      const cacheKey = `${fieldName}-${JSON.stringify(value)}`;
      if (validationCacheRef.current.has(cacheKey)) {
        return validationCacheRef.current.get(cacheKey);
      }

      // Perform validation
      const result = validator(value);
      validationCacheRef.current.set(cacheKey, result);
      
      // Cleanup old cache entries (keep last 50)
      if (validationCacheRef.current.size > 50) {
        const entries = Array.from(validationCacheRef.current.entries());
        validationCacheRef.current.clear();
        entries.slice(-25).forEach(([key, val]) => {
          validationCacheRef.current.set(key, val);
        });
      }

      return result;
    }, debounceMs),
    [debounceMs, validateOnChange]
  );

  // Optimistic update handler
  const handleOptimisticUpdate = useCallback(
    (fieldName: string, value: unknown) => {
      if (!enableOptimisticUpdates) return;
      
      optimisticUpdatesRef.current.set(fieldName, {
        value,
        timestamp: Date.now(),
      });
    },
    [enableOptimisticUpdates]
  );

  // Cleanup function for memory leak prevention
  const cleanup = useCallback(() => {
    debouncedValidation.cancel();
    validationCacheRef.current.clear();
    optimisticUpdatesRef.current.clear();
  }, [debouncedValidation]);

  // Get optimistic value
  const getOptimisticValue = useCallback(
    (fieldName: string, currentValue: unknown) => {
      if (!enableOptimisticUpdates) return currentValue;
      
      const optimistic = optimisticUpdatesRef.current.get(fieldName);
      if (optimistic && Date.now() - optimistic.timestamp < 5000) {
        return optimistic.value;
      }
      
      return currentValue;
    },
    [enableOptimisticUpdates]
  );

  // Memory-efficient field change handler
  const createFieldChangeHandler = useCallback(
    (fieldName: string, validator?: (value: unknown) => any) => {
      return (value: unknown) => {
        // Handle optimistic update
        handleOptimisticUpdate(fieldName, value);
        
        // Trigger debounced validation
        debouncedValidation(fieldName, value, validator);
      };
    },
    [handleOptimisticUpdate, debouncedValidation]
  );

  return {
    debouncedValidation,
    handleOptimisticUpdate,
    getOptimisticValue,
    createFieldChangeHandler,
    cleanup,
  };
}
