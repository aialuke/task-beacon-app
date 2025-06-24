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
interface BaseFloatingInputProps extends BaseComponentProps {
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

// Floating Textarea Props
export interface FloatingTextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  error?: string;
  className?: string;
  disabled?: boolean;
}

// Action Button Props
export interface ActionButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}






