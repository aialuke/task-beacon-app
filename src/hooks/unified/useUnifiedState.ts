
/**
 * Unified State Management Hook - Step 2.4 Implementation
 * 
 * Consolidates various state management patterns into a single,
 * consistent system. Replaces scattered state logic throughout the app.
 */

import { useState, useCallback, useReducer, useRef, useEffect } from 'react';
import { useOptimizedCallback, useOptimizedMemo } from '@/hooks/performance';

// === STATE TYPES ===
interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface StateOptions<T> {
  initialValue?: T;
  onStateChange?: (newState: T, previousState: T) => void;
  enableHistory?: boolean;
  maxHistorySize?: number;
}

interface AsyncStateOptions<T> {
  initialData?: T | null;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  resetOnNewOperation?: boolean;
}

// === STATE ACTIONS ===
type StateAction<T> = 
  | { type: 'SET_VALUE'; payload: T }
  | { type: 'RESET'; payload?: T }
  | { type: 'UNDO' }
  | { type: 'REDO' };

type AsyncStateAction<T> = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SUCCESS'; payload: T }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'RESET' };

// === REDUCERS ===
function stateReducer<T>(state: { current: T; history: T[] }, action: StateAction<T>) {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        current: action.payload,
        history: [...state.history, state.current].slice(-10), // Keep last 10 states
      };
    case 'RESET':
      return {
        current: action.payload || state.history[0] || state.current,
        history: [],
      };
    case 'UNDO':
      if (state.history.length === 0) return state;
      const previous = state.history[state.history.length - 1];
      return {
        current: previous,
        history: state.history.slice(0, -1),
      };
    default:
      return state;
  }
}

function asyncStateReducer<T>(state: AsyncState<T>, action: AsyncStateAction<T>): AsyncState<T> {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error,
      };
    case 'SET_SUCCESS':
      return {
        data: action.payload,
        loading: false,
        error: null,
        success: true,
      };
    case 'SET_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };
    case 'RESET':
      return {
        data: null,
        loading: false,
        error: null,
        success: false,
      };
    default:
      return state;
  }
}

/**
 * Enhanced state hook with history and callbacks
 */
export function useUnifiedState<T>(initialValue: T, options: StateOptions<T> = {}) {
  const { onStateChange, enableHistory = false } = options;
  
  const [state, dispatch] = useReducer(stateReducer<T>, {
    current: initialValue,
    history: [],
  });

  const setValue = useOptimizedCallback(
    (newValue: T | ((prev: T) => T)) => {
      const resolvedValue = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(state.current)
        : newValue;
      
      if (onStateChange) {
        onStateChange(resolvedValue, state.current);
      }
      
      dispatch({ type: 'SET_VALUE', payload: resolvedValue });
    },
    [state.current, onStateChange],
    { name: 'setValue' }
  );

  const reset = useOptimizedCallback(
    (resetValue?: T) => {
      dispatch({ type: 'RESET', payload: resetValue });
    },
    [],
    { name: 'reset' }
  );

  const undo = useOptimizedCallback(() => {
    if (enableHistory) {
      dispatch({ type: 'UNDO' });
    }
  }, [enableHistory], { name: 'undo' });

  return useOptimizedMemo(
    () => ({
      value: state.current,
      setValue,
      reset,
      undo: enableHistory ? undo : undefined,
      canUndo: enableHistory && state.history.length > 0,
      history: enableHistory ? state.history : undefined,
    }),
    [state, setValue, reset, undo, enableHistory],
    { name: 'unifiedState' }
  );
}

/**
 * Unified async state management
 */
export function useUnifiedAsyncState<T>(options: AsyncStateOptions<T> = {}) {
  const { initialData = null, onSuccess, onError, resetOnNewOperation = true } = options;
  
  const [state, dispatch] = useReducer(asyncStateReducer<T>, {
    data: initialData,
    loading: false,
    error: null,
    success: false,
  });

  const setLoading = useOptimizedCallback(
    (loading: boolean) => {
      dispatch({ type: 'SET_LOADING', payload: loading });
    },
    [],
    { name: 'setAsyncLoading' }
  );

  const setSuccess = useOptimizedCallback(
    (data: T) => {
      dispatch({ type: 'SET_SUCCESS', payload: data });
      onSuccess?.(data);
    },
    [onSuccess],
    { name: 'setAsyncSuccess' }
  );

  const setError = useOptimizedCallback(
    (error: string) => {
      dispatch({ type: 'SET_ERROR', payload: error });
      onError?.(error);
    },
    [onError],
    { name: 'setAsyncError' }
  );

  const reset = useOptimizedCallback(() => {
    dispatch({ type: 'RESET' });
  }, [], { name: 'resetAsync' });

  const executeAsync = useOptimizedCallback(
    async <R>(operation: () => Promise<R>): Promise<R | null> => {
      if (resetOnNewOperation) {
        reset();
      }
      
      setLoading(true);
      
      try {
        const result = await operation();
        setSuccess(result as unknown as T);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setError(errorMessage);
        return null;
      }
    },
    [setLoading, setSuccess, setError, reset, resetOnNewOperation],
    { name: 'executeAsync' }
  );

  return useOptimizedMemo(
    () => ({
      ...state,
      setLoading,
      setSuccess,
      setError,
      reset,
      executeAsync,
    }),
    [state, setLoading, setSuccess, setError, reset, executeAsync],
    { name: 'unifiedAsyncState' }
  );
}

/**
 * Unified collection state (for arrays)
 */
export function useUnifiedCollection<T>(initialItems: T[] = []) {
  const [items, setItems] = useState<T[]>(initialItems);
  
  const addItem = useOptimizedCallback(
    (item: T) => {
      setItems(prev => [...prev, item]);
    },
    [],
    { name: 'addItem' }
  );

  const removeItem = useOptimizedCallback(
    (index: number) => {
      setItems(prev => prev.filter((_, i) => i !== index));
    },
    [],
    { name: 'removeItem' }
  );

  const updateItem = useOptimizedCallback(
    (index: number, updater: T | ((prev: T) => T)) => {
      setItems(prev => prev.map((item, i) => 
        i === index 
          ? typeof updater === 'function' ? (updater as (prev: T) => T)(item) : updater
          : item
      ));
    },
    [],
    { name: 'updateItem' }
  );

  const moveItem = useOptimizedCallback(
    (fromIndex: number, toIndex: number) => {
      setItems(prev => {
        const newItems = [...prev];
        const [removed] = newItems.splice(fromIndex, 1);
        newItems.splice(toIndex, 0, removed);
        return newItems;
      });
    },
    [],
    { name: 'moveItem' }
  );

  const clear = useOptimizedCallback(() => {
    setItems([]);
  }, [], { name: 'clearCollection' });

  return useOptimizedMemo(
    () => ({
      items,
      setItems,
      addItem,
      removeItem,
      updateItem,
      moveItem,
      clear,
      count: items.length,
      isEmpty: items.length === 0,
    }),
    [items, addItem, removeItem, updateItem, moveItem, clear],
    { name: 'unifiedCollection' }
  );
}
