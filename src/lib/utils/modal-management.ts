
/**
 * Consolidated Modal Management Utilities
 * 
 * Provides centralized modal state management with support for
 * multiple modals, stacking, and global controls.
 */

import React, { useCallback, useContext, createContext, useState, useRef, useEffect } from 'react';

/**
 * Modal configuration interface
 */
export interface ModalConfig {
  id: string;
  component: React.ComponentType<any>;
  props?: Record<string, unknown>;
  persistent?: boolean; // Cannot be closed by ESC or backdrop click
  priority?: number; // Higher priority modals appear on top
  onClose?: () => void;
}

/**
 * Modal state interface
 */
export interface ModalState extends ModalConfig {
  isOpen: boolean;
  zIndex: number;
}

/**
 * Modal manager context value
 */
interface ModalManagerContextValue {
  modals: ModalState[];
  openModal: (config: ModalConfig) => void;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  isModalOpen: (id: string) => boolean;
  getActiveModalCount: () => number;
}

/**
 * Modal manager context
 */
const ModalManagerContext = createContext<ModalManagerContextValue | null>(null);

/**
 * Base z-index for modals
 */
const BASE_MODAL_Z_INDEX = 1000;

/**
 * Modal manager provider component
 */
export function ModalManagerProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<ModalState[]>([]);
  const nextZIndex = useRef(BASE_MODAL_Z_INDEX);

  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const topModal = modals
          .filter(modal => modal.isOpen && !modal.persistent)
          .sort((a, b) => b.zIndex - a.zIndex)[0];
        
        if (topModal) {
          closeModal(topModal.id);
        }
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => { document.removeEventListener('keydown', handleEscapeKey); };
  }, [modals]);

  const openModal = useCallback((config: ModalConfig) => {
    setModals(prev => {
      const existingIndex = prev.findIndex(modal => modal.id === config.id);
      const zIndex = nextZIndex.current++;
      
      const newModalState: ModalState = {
        ...config,
        isOpen: true,
        zIndex,
      };

      if (existingIndex >= 0) {
        // Update existing modal
        const updated = [...prev];
        updated[existingIndex] = newModalState;
        return updated;
      } else {
        // Add new modal
        return [...prev, newModalState];
      }
    });
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals(prev => {
      const modal = prev.find(m => m.id === id);
      if (modal?.onClose) {
        modal.onClose();
      }
      return prev.map(modal =>
        modal.id === id ? { ...modal, isOpen: false } : modal
      );
    });

    // Clean up closed modals after animation
    setTimeout(() => {
      setModals(prev => prev.filter(modal => modal.isOpen));
    }, 300);
  }, []);

  const closeAllModals = useCallback(() => {
    setModals(prev => {
      // Call onClose for all modals
      prev.forEach(modal => {
        if (modal.onClose) {
          modal.onClose();
        }
      });
      
      return prev.map(modal => ({ ...modal, isOpen: false }));
    });

    // Clean up after animation
    setTimeout(() => {
      setModals([]);
    }, 300);
  }, []);

  const isModalOpen = useCallback((id: string) => {
    return modals.some(modal => modal.id === id && modal.isOpen);
  }, [modals]);

  const getActiveModalCount = useCallback(() => {
    return modals.filter(modal => modal.isOpen).length;
  }, [modals]);

  const value: ModalManagerContextValue = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
    getActiveModalCount,
  };

  const modalElements = modals.map(modal => {
    if (!modal.isOpen) return null;
    
    const ModalComponent = modal.component;
    const modalProps = {
      ...modal.props,
      isOpen: modal.isOpen,
      onClose: () => { closeModal(modal.id); }
    };

    return React.createElement(
      'div',
      {
        key: modal.id,
        style: { zIndex: modal.zIndex },
        className: 'fixed inset-0'
      },
      React.createElement(ModalComponent, modalProps)
    );
  }).filter(Boolean);

  return React.createElement(
    ModalManagerContext.Provider,
    { value },
    children,
    ...modalElements
  );
}

/**
 * Hook to use modal manager
 */
export function useModalManager() {
  const context = useContext(ModalManagerContext);
  if (!context) {
    throw new Error('useModalManager must be used within a ModalManagerProvider');
  }
  return context;
}

/**
 * Hook for individual modal management
 */
export function useModal(modalId: string) {
  const { openModal, closeModal, isModalOpen } = useModalManager();

  const open = useCallback((config?: Partial<ModalConfig>) => {
    openModal({
      id: modalId,
      component: () => null, // This should be overridden
      ...config,
    });
  }, [modalId, openModal]);

  const close = useCallback(() => {
    closeModal(modalId);
  }, [modalId, closeModal]);

  const toggle = useCallback((config?: Partial<ModalConfig>) => {
    if (isModalOpen(modalId)) {
      close();
    } else {
      open(config);
    }
  }, [modalId, isModalOpen, open, close]);

  return {
    isOpen: isModalOpen(modalId),
    open,
    close,
    toggle,
  };
}

/**
 * Predefined modal types for common use cases
 */
export const modalPresets = {
  confirmation: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ): Partial<ModalConfig> => ({
    props: { title, message, onConfirm, onCancel },
    persistent: false,
    priority: 100,
  }),

  form: (
    title: string,
    FormComponent: React.ComponentType<unknown>,
    formProps?: Record<string, unknown>
  ): Partial<ModalConfig> => ({
    props: { title, FormComponent, ...formProps },
    persistent: true,
    priority: 50,
  }),

  info: (
    title: string,
    content: React.ReactNode
  ): Partial<ModalConfig> => ({
    props: { title, content },
    persistent: false,
    priority: 25,
  }),
};

/**
 * Higher-order component for modal-enabled components
 */
export function withModal<T extends object>(
  Component: React.ComponentType<T>,
  modalId: string
) {
  return function ModalEnabledComponent(props: T) {
    const modal = useModal(modalId);
    
    return React.createElement(Component, { ...props, modal });
  };
}

/**
 * Modal registry for dynamic modal management
 */
class ModalRegistry {
  private modals = new Map<string, React.ComponentType<unknown>>();

  register(id: string, component: React.ComponentType<unknown>) {
    this.modals.set(id, component);
  }

  unregister(id: string) {
    this.modals.delete(id);
  }

  get(id: string) {
    return this.modals.get(id);
  }

  getAll() {
    return Array.from(this.modals.entries());
  }
}

export const modalRegistry = new ModalRegistry();

/**
 * Hook to register modal components
 */
export function useModalRegistry(id: string, component: React.ComponentType<unknown>) {
  useEffect(() => {
    modalRegistry.register(id, component);
    return () => { modalRegistry.unregister(id); };
  }, [id, component]);
}

// Export modal utilities namespace
export const modalUtils = {
  ModalManagerProvider,
  useModalManager,
  useModal,
  withModal,
  modalPresets,
  modalRegistry,
  useModalRegistry,
};
