/**
 * Utility Types - TypeScript Helpers
 * 
 * Advanced TypeScript utility types for better type manipulation and safety.
 */

// Object manipulation utilities
// State management utilities moved to @/types/async-state.types.ts to eliminate duplication

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
// Array and record utilities
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

// Component prop utilities moved to @/types/component.types.ts to eliminate duplication
export type { 
  PropsWithClassName, 
  PropsWithChildren, 
  BaseComponentProps 
} from './component.types';

// Event handler utilities
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// ID and timestamp utilities
export type ID = string;
export type Timestamp = string; // ISO 8601 format

// Status utilities
export type Status = 'idle' | 'loading' | 'success' | 'error';
// AsyncOperationState moved to @/types/async-state.types.ts to eliminate duplication
export type { AsyncOperationState } from './async-state.types';
