/**
 * Utility Types - TypeScript Helpers
 *
 * Advanced TypeScript utility types for better type manipulation and safety.
 */

// Object manipulation utilities
// State management utilities moved to @/types/async-state.types.ts to eliminate duplication
import type { BaseAsyncState } from './async-state.types';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type Merge<T, U> = Omit<T, keyof U> & U;
type Override<T, U> = Omit<T, keyof U> & U;

// Key and value utilities
type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type ValuesOfType<T, U> = T[KeysOfType<T, U>];

type NonNullable<T> = T extends null | undefined ? never : T;

// Array and record utilities
type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;
type RecordValue<T> = T extends Record<string, infer U> ? U : never;

// Function utilities - Fixed parameter types
type AsyncReturnType<T extends (...args: unknown[]) => Promise<unknown>> =
  T extends (...args: unknown[]) => Promise<infer R> ? R : never;

type Parameters<T extends (...args: unknown[]) => unknown> = T extends (
  ...args: infer P
) => unknown
  ? P
  : never;

// Conditional utilities
type If<C extends boolean, T, F> = C extends true ? T : F;
type Equals<T, U> = T extends U ? (U extends T ? true : false) : false;

// String utilities
type Capitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${R}`
  : S;

type Uncapitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Lowercase<F>}${R}`
  : S;

// Component prop utilities moved to @/types/component.types.ts to eliminate duplication;

// Additional prop utilities
type PropsWithTestId<P = Record<string, never>> = P & {
  testId?: string;
};

// API utilities
type ApiState<T> = BaseAsyncState<T> & {
  success: boolean;
  lastFetch?: Date;
};

// Form utilities removed - types not used in codebase

// Validation interfaces
interface ValidationRule<T = unknown> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

// Use canonical ValidationResult from validators;

// Event handler utilities
type EventHandler<T = Event> = (event: T) => void;
type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// ID and timestamp utilities
export type ID = string;
export type Timestamp = string; // ISO 8601 format

// Status utilities
export type Status = 'idle' | 'loading' | 'success' | 'error';
// AsyncOperationState moved to @/types/async-state.types.ts to eliminate duplication;
