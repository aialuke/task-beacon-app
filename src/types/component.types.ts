
/**
 * Component Types - UI Component System
 * 
 * Standardized props and interfaces for UI components.
 */

import type { ReactNode } from 'react';

// Base component props
export interface BaseComponentProps {
  className?: string;
  id?: string;
  testId?: string;
  children?: ReactNode;
}

// Layout component props
export interface LayoutProps extends BaseComponentProps {
  width?: string | number;
  height?: string | number;
  padding?: string | number;
  margin?: string | number;
}

// Interactive component props
export interface InteractiveProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

// Size and variant types
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ColorScheme = 'light' | 'dark' | 'auto';

// Button component props
export interface ButtonProps extends BaseComponentProps, InteractiveProps {
  variant?: Variant;
  size?: Size;
  type?: 'button' | 'submit' | 'reset';
  asChild?: boolean;
}

// Modal and dialog props
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
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
  variant?: 'default' | 'outlined' | 'elevated';
}

// Navigation props
export interface NavItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isCurrentPage?: boolean;
}

// Table component props
export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string | number;
  render?: (value: unknown, item: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = unknown> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  selectable?: boolean;
  selectedItems?: T[];
  onSelectionChange?: (items: T[]) => void;
}

// Loading and feedback props
export interface LoadingProps extends BaseComponentProps {
  size?: Size;
  message?: string;
  overlay?: boolean;
}

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: DialogAction;
  onDismiss: () => void;
}

// Animation and motion props
export interface AnimationProps {
  duration?: number;
  delay?: number;
  easing?: string;
  disabled?: boolean;
}

// Responsive design types
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;
