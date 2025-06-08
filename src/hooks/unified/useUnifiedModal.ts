
/**
 * Unified Modal Management Hook
 * 
 * Consolidates multiple modal management patterns into a single,
 * consistent system. Replaces scattered modal state logic.
 */

// === EXTERNAL LIBRARIES ===
import { useState, useCallback, useEffect } from 'react';

// === INTERNAL UTILITIES ===
import { useOptimizedCallback, useOptimizedMemo } from '@/hooks/performance';

// === TYPES ===
interface ModalState {
  isOpen: boolean;
  data?: unknown;
  loading?: boolean;
  error?: string | null;
}

interface ModalActions {
  open: (data?: unknown) => void;
  close: () => void;
  toggle: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

interface ModalOptions {
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  preventScroll?: boolean;
  onOpen?: (data?: unknown) => void;
  onClose?: () => void;
}

/**
 * Unified modal management hook
 * Consolidates various modal patterns used throughout the application
 */
export function useUnifiedModal(options: ModalOptions = {}): [ModalState, ModalActions] {
  const {
    closeOnEscape = true,
    closeOnBackdrop = true,
    preventScroll = true,
    onOpen,
    onClose,
  } = options;

  const [state, setState] = useState<ModalState>({
    isOpen: false,
    data: undefined,
    loading: false,
    error: null,
  });

  // Open modal
  const open = useOptimizedCallback(
    (data?: unknown) => {
      setState(prev => ({
        ...prev,
        isOpen: true,
        data,
        error: null,
      }));
      
      if (preventScroll) {
        document.body.style.overflow = 'hidden';
      }
      
      onOpen?.(data);
    },
    [preventScroll, onOpen],
    { name: 'openModal' }
  );

  // Close modal
  const close = useOptimizedCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false,
      loading: false,
      error: null,
    }));
    
    if (preventScroll) {
      document.body.style.overflow = '';
    }
    
    onClose?.();
  }, [preventScroll, onClose], { name: 'closeModal' });

  // Toggle modal
  const toggle = useOptimizedCallback(() => {
    if (state.isOpen) {
      close();
    } else {
      open();
    }
  }, [state.isOpen, open, close], { name: 'toggleModal' });

  // Set loading state
  const setLoading = useOptimizedCallback(
    (loading: boolean) => {
      setState(prev => ({ ...prev, loading }));
    },
    [],
    { name: 'setModalLoading' }
  );

  // Set error state
  const setError = useOptimizedCallback(
    (error: string | null) => {
      setState(prev => ({ ...prev, error, loading: false }));
    },
    [],
    { name: 'setModalError' }
  );

  // Reset modal state
  const reset = useOptimizedCallback(() => {
    setState({
      isOpen: false,
      data: undefined,
      loading: false,
      error: null,
    });
    
    if (preventScroll) {
      document.body.style.overflow = '';
    }
  }, [preventScroll], { name: 'resetModal' });

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !state.isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => { document.removeEventListener('keydown', handleEscape); };
  }, [closeOnEscape, state.isOpen, close]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (preventScroll) {
        document.body.style.overflow = '';
      }
    };
  }, [preventScroll]);

  // Create actions object
  const actions: ModalActions = useOptimizedMemo(
    () => ({
      open,
      close,
      toggle,
      setLoading,
      setError,
      reset,
    }),
    [open, close, toggle, setLoading, setError, reset],
    { name: 'modalActions' }
  );

  return [state, actions];
}

/**
 * Hook for multiple modals management
 */
export function useUnifiedModals<T extends string>(
  modalIds: readonly T[],
  options: Partial<Record<T, ModalOptions>> = {}
): Record<T, [ModalState, ModalActions]> {
  const modals = {} as Record<T, [ModalState, ModalActions]>;

  for (const id of modalIds) {
    const modalOptions = options[id] || {};
    // eslint-disable-next-line react-hooks/rules-of-hooks
    modals[id] = useUnifiedModal(modalOptions);
  }

  return modals;
}
