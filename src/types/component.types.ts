
/**
 * Component Types - UI Component Interfaces
 * 
 * Standardized component prop interfaces and UI-related types.
 */

import type { ReactNode } from 'react';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  testId?: string;
}

// Size and variant types
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
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
  action: () => void;
  variant?: Variant;
  disabled?: boolean;
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

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

// Table component types
export interface TableColumn<T = unknown> {
  key: string;
  title: string;
  render?: (value: unknown, record: T) => ReactNode;
  sortable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
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

// Responsive design types
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveValue<T> {
  base?: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
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
// CodeRabbit review
