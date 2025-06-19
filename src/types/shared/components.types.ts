import type { ChangeEvent, ReactNode } from 'react';

/**
 * Shared Component Type Definitions
 * 
 * Centralized types for reusable UI components to ensure consistency
 * and prevent duplication across different component implementations.
 */

// Base Props for all components
export interface BaseComponentProps {
  className?: string;
  disabled?: boolean;
}

// Base Floating Input Component Props
export interface BaseFloatingInputProps extends BaseComponentProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
  error?: string;
}

// Auth variant - value-based onChange
export interface AuthFloatingInputProps extends BaseFloatingInputProps {
  onChange: (value: string) => void;
}

// Form variant - event-based onChange with icon support
export interface FormFloatingInputProps extends BaseFloatingInputProps {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
}

// Union type for components that need to support both
export type FloatingInputProps = AuthFloatingInputProps | FormFloatingInputProps;

// Floating Textarea Component Props
export interface FloatingTextareaProps extends BaseComponentProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  icon?: ReactNode;
  error?: string;
}

// Button Component Props
export interface ActionButtonProps extends BaseComponentProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  active?: boolean;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

// Modal Component Props
export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
}

// Loading States
export interface LoadingStateProps {
  isLoading?: boolean;
  loadingMessage?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Error States
export interface ErrorStateProps {
  error?: string | Error | null;
  onRetry?: () => void;
  variant?: 'inline' | 'section' | 'page';
}