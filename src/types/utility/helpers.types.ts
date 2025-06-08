/**
 * TypeScript Helper Types
 * 
 * Core utility types for object manipulation and React components.
 * Used across the application for type safety and convenience.
 */

// Deep object manipulation types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Object manipulation types
export type Merge<T, U> = Omit<T, keyof U> & U;

export type Override<T, U> = Omit<T, keyof U> & U;

// Component types
export type PropsWithClassName<P = Record<string, never>> = P & { className?: string };

export type PropsWithChildren<P = Record<string, never>> = P & { children?: React.ReactNode };
// CodeRabbit review
