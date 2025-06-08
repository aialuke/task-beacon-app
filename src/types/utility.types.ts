
/**
 * Utility Types - TypeScript Helpers
 * 
 * Advanced TypeScript utility types for better type manipulation and safety.
 */

// Object manipulation utilities
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type Merge<T, U> = Omit<T, keyof U> & U;
export type Override<T, U> = Omit<T, keyof U> & U;

// Key and value utilities
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type ValuesOfType<T, U> = T[KeysOfType<T, U>];

export type NonNullable<T> = T extends null | undefined ? never : T;

// Array and record utilities
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;
export type RecordValue<T> = T extends Record<string, infer U> ? U : never;

// Function utilities - Fixed parameter types
export type AsyncReturnType<T extends (...args: any[]) => Promise<any>> = 
  T extends (...args: any[]) => Promise<infer R> ? R : never;

export type Parameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;

// Conditional utilities
export type If<C extends boolean, T, F> = C extends true ? T : F;
export type Equals<T, U> = T extends U ? (U extends T ? true : false) : false;

// String utilities
export type Capitalize<S extends string> = S extends `${infer F}${infer R}` 
  ? `${Uppercase<F>}${R}` 
  : S;

export type Uncapitalize<S extends string> = S extends `${infer F}${infer R}` 
  ? `${Lowercase<F>}${R}` 
  : S;

// Component prop utilities
export type PropsWithClassName<P = Record<string, never>> = P & { className?: string };
export type PropsWithChildren<P = Record<string, never>> = P & { children?: React.ReactNode };
export type PropsWithTestId<P = Record<string, never>> = P & { testId?: string };

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

// State management utilities
export interface AsyncState<T, E = string> {
  data: T | null;
  loading: boolean;
  error: E | null;
};

export interface LoadingState {
  isLoading: boolean;
  isSubmitting?: boolean;
  isValidating?: boolean;
};

// API utilities
export type ApiState<T> = AsyncState<T> & {
  success: boolean;
  lastFetch?: Date;
};

// Form utilities
export type FormErrors<T> = Partial<Record<keyof T, string>>;
export type FormTouched<T> = Partial<Record<keyof T, boolean>>;

// Form state interface
export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Validation interfaces
export interface ValidationRule<T = unknown> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings?: Record<string, string>;
}

// Event handler utilities
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// ID and timestamp utilities
export type ID = string;
export type Timestamp = string; // ISO 8601 format

// Status utilities
export type Status = 'idle' | 'loading' | 'success' | 'error';
export interface AsyncOperationState {
  status: Status;
  error?: string;
  data?: unknown;
};
// CodeRabbit review
