import { useState, useCallback } from 'react';

/**
 * Standardized modal state management hook
 * 
 * Provides consistent modal state patterns across the application.
 * Replaces individual modal state implementations.
 */
export interface UseModalStateOptions {
  initialOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export function useModalState(options: UseModalStateOptions = {}) {
  const { initialOpen = false, onOpen, onClose } = options;
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
