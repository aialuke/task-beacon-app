/**
 * Shared UI Types
 * 
 * Types for layout, theming, UI components, and visual patterns
 * used throughout the application.
 */

// Theme and styling types
export type ColorScheme = 'light' | 'dark' | 'auto';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// Layout types
export interface LayoutProps {
  className?: string;
  children?: React.ReactNode;
  fullWidth?: boolean;
  centered?: boolean;
  padding?: Size;
  margin?: Size;
}

export interface ContainerProps extends LayoutProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  background?: string;
}

// Component size and variant system
export interface ComponentVariants {
  size?: Size;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
}

// Button types
export interface ButtonProps extends ComponentVariants {
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  children?: React.ReactNode;
}

// Input field types
export interface InputProps extends ComponentVariants {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
}

// Modal and dialog types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: Size;
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
  children?: React.ReactNode;
}

export interface DialogAction {
  label: string;
  variant?: Variant;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// Card and panel types
export interface CardProps {
  className?: string;
  children?: React.ReactNode;
  padding?: Size;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  rounded?: Size;
}

// Navigation types
export interface NavItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  badge?: string | number;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

// Table types
export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  sortBy?: keyof T;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: keyof T) => void;
  onRowClick?: (row: T) => void;
}

// Form types
export interface FormFieldProps extends InputProps {
  label?: string;
  description?: string;
  required?: boolean;
  error?: string;
  warning?: string;
}

// Toast/Notification UI types
export interface ToastProps {
  id?: string;
  type?: Variant;
  title: string;
  message?: string;
  duration?: number;
  showIcon?: boolean;
  showCloseButton?: boolean;
  actions?: DialogAction[];
}

// Animation types
export interface AnimationProps {
  duration?: number;
  delay?: number;
  easing?: string;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

// Responsive breakpoint types
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveValue<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

// Loading and skeleton types
export interface LoadingProps {
  size?: Size;
  color?: string;
  thickness?: number;
}

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: Size;
  count?: number;
  className?: string;
}

// Drag and drop types
export interface DragItem {
  id: string;
  type: string;
  data: any;
}

export interface DropTarget {
  accepts: string[];
  onDrop: (item: DragItem) => void;
  onDragOver?: (item: DragItem) => void;
  onDragLeave?: () => void;
} 