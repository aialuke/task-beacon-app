/**
 * Component Types - UI Component Interfaces
 *
 * Standardized component prop interfaces and UI-related types.
 */

import type { ReactNode } from 'react';

// === COMPONENT PROP UTILITIES ===

// Component prop utilities
export type PropsWithClassName<P = Record<string, never>> = P & {
  className?: string;
};
export type PropsWithChildren<P = Record<string, never>> = P & {
  children?: ReactNode;
};
export type PropsWithTestId<P = Record<string, never>> = P & {
  testId?: string;
};

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  testId?: string;
}

// === UI COMPONENT INTERFACES ===

// Basic UI types
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost';
export type ColorScheme = 'light' | 'dark' | 'auto';

// Layout props
export interface LayoutProps extends BaseComponentProps {
  padding?: Size;
  margin?: Size;
  fullWidth?: boolean;
  centered?: boolean;
}

// Button component props
export interface ButtonProps extends BaseComponentProps {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// Modal and dialog props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: Size;
}

export interface DialogAction {
  label: string;
  onClick: () => void;
  variant?: Variant;
}

// Card component props
export interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  footer?: ReactNode;
  padding?: Size;
  border?: boolean;
  shadow?: boolean;
}

// Navigation props
export interface NavItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface NavProps extends BaseComponentProps {
  items: NavItem[];
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
}

// Table component types
export interface TableColumn<T = unknown> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: T[keyof T], row: T) => ReactNode;
}

export interface TableProps<T = unknown> extends BaseComponentProps {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: boolean;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
}

// Loading and feedback props
export interface LoadingProps extends BaseComponentProps {
  size?: Size;
  text?: string;
  overlay?: boolean;
}

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: DialogAction;
}

// Animation and interaction props
export interface AnimationProps {
  duration?: number;
  delay?: number;
  easing?: string;
  disabled?: boolean;
}

export interface InteractionProps {
  onClick?: () => void;
  onHover?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
}

// Form field component props
export interface InputFieldProps extends BaseComponentProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'number';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}

export interface TextareaFieldProps extends BaseComponentProps {
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  rows?: number;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}

export interface SelectFieldProps extends BaseComponentProps {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}
