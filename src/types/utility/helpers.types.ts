/**
 * TypeScript Helper Types
 * 
 * Advanced TypeScript utility types and type helpers for better type safety
 * and developer experience across the application.
 */

// Utility type helpers
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// Key manipulation types
export type StringKeys<T> = Extract<keyof T, string>;
export type NumberKeys<T> = Extract<keyof T, number>;
export type SymbolKeys<T> = Extract<keyof T, symbol>;

export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export type OptionalKeys<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? K : never;
}[keyof T];

export type RequiredKeys<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? never : K;
}[keyof T];

// Object manipulation types
export type Merge<T, U> = Omit<T, keyof U> & U;

export type Override<T, U> = Omit<T, keyof U> & U;

export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type RequiredExcept<T, K extends keyof T> = Required<T> & Partial<Pick<T, K>>;

export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

export type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

// Function type helpers
export type ArgumentTypes<F> = F extends (...args: infer A) => unknown ? A : never;

export type ReturnTypeAsync<F> = F extends (...args: unknown[]) => Promise<infer R> ? R : never;

export type FirstArgument<F> = F extends (arg: infer A, ...rest: unknown[]) => unknown ? A : never;

export type LastArgument<F> = F extends (...args: [...unknown[], infer L]) => unknown ? L : never;

// Array and tuple helpers
export type Head<T extends readonly unknown[]> = T extends readonly [infer H, ...unknown[]] ? H : never;

export type Tail<T extends readonly unknown[]> = T extends readonly [unknown, ...infer R] ? R : never;

export type Last<T extends readonly unknown[]> = T extends readonly [...unknown[], infer L] ? L : never;

export type Length<T extends readonly unknown[]> = T['length'];

export type Reverse<T extends readonly unknown[]> = T extends readonly [...infer Rest, infer Last]
  ? [Last, ...Reverse<Rest>]
  : [];

export type Flatten<T extends readonly unknown[]> = T extends readonly [infer First, ...infer Rest]
  ? First extends readonly unknown[]
    ? [...Flatten<First>, ...Flatten<Rest>]
    : [First, ...Flatten<Rest>]
  : [];

// String manipulation types
export type Split<S extends string, D extends string> = S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

export type Join<T extends readonly string[], D extends string> = T extends readonly [
  infer F,
  ...infer R
]
  ? F extends string
    ? R extends readonly string[]
      ? R['length'] extends 0
        ? F
        : `${F}${D}${Join<R, D>}`
      : never
    : never
  : '';

export type Capitalize<S extends string> = S extends `${infer F}${infer R}` 
  ? `${Uppercase<F>}${R}` 
  : S;

export type Uncapitalize<S extends string> = S extends `${infer F}${infer R}` 
  ? `${Lowercase<F>}${R}` 
  : S;

export type CamelCase<S extends string> = S extends `${infer F}_${infer R}`
  ? `${F}${Capitalize<CamelCase<R>>}`
  : S;

export type SnakeCase<S extends string> = S extends `${infer F}${infer R}`
  ? F extends Uppercase<F>
    ? `_${Lowercase<F>}${SnakeCase<R>}`
    : `${F}${SnakeCase<R>}`
  : S;

// Conditional types
export type If<C extends boolean, T, F> = C extends true ? T : F;

export type IsAny<T> = 0 extends 1 & T ? true : false;

export type IsNever<T> = [T] extends [never] ? true : false;

export type IsUnknown<T> = IsAny<T> extends true ? false : unknown extends T ? true : false;

export type IsEqual<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false;

export type IsArray<T> = T extends readonly unknown[] ? true : false;

export type IsFunction<T> = T extends (...args: unknown[]) => unknown ? true : false;

export type IsObject<T> = T extends object 
  ? T extends unknown[] 
    ? false 
    : T extends (...args: unknown[]) => unknown
    ? false 
    : true 
  : false;

// Branded types for type safety
export type Brand<T, B> = T & { __brand: B };

export type Branded<T, B extends string> = T & { readonly __brand: unique symbol; readonly __type: B };

export type Unbrand<T> = T extends Brand<infer U, unknown> ? U : T;

// Event handler types
export type EventMap = {
  [K: string]: unknown[];
};

export type EventHandler<T extends EventMap, K extends keyof T> = (...args: T[K]) => void;

export type EventHandlers<T extends EventMap> = {
  [K in keyof T]: EventHandler<T, K>;
};

// Promise and async helpers
export type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

export type PromiseType<T> = T extends Promise<infer U> ? U : never;

export type MaybePromise<T> = T | Promise<T>;

export type PromiseValue<T> = T extends Promise<infer U> ? U : T;

// JSON types
export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export type JsonObject = { [key: string]: JsonValue };

export type JsonArray = JsonValue[];

export type Jsonifiable<T> = {
  [K in keyof T]: T[K] extends JsonValue
    ? T[K]
    : T[K] extends Date
    ? string
    : T[K] extends RegExp
    ? string
    : T[K] extends Function
    ? never
    : T[K] extends object
    ? Jsonifiable<T[K]>
    : never;
};

// Path and nested object types
export type Path<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}` | `${K}.${Path<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

export type PathValue<T, P extends Path<T>> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Path<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never;

// Simplified SetPath type to avoid constraint issues
export type SetPath<T, P extends string, V> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? { [Key in keyof T]: Key extends K ? SetPath<T[Key], Rest, V> : T[Key] }
    : T
  : P extends keyof T
  ? { [Key in keyof T]: Key extends P ? V : T[Key] }
  : T;

// Database and API helpers
export type TableInsert<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;

export type TableUpdate<T> = Partial<Omit<T, 'id' | 'created_at'>> & { updated_at?: string };

export type ApiResponse<T> = {
  data: T;
  success: true;
  error: null;
} | {
  data: null;
  success: false;
  error: string;
};

export type QueryParams<T> = Partial<{
  [K in keyof T]: T[K] extends string | number | boolean | null | undefined
    ? T[K] | T[K][]
    : never;
}>;

// Validation helpers
export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export type FormErrors<T> = {
  [K in keyof T]?: T[K] extends object ? FormErrors<T[K]> : string;
};

// Component prop helpers
export type PropsWithClassName<T = Record<string, never>> = T & { className?: string };

export type PropsWithChildren<T = Record<string, never>> = T & { children?: React.ReactNode };

export type ComponentProps<T> = T extends React.ComponentType<infer P> ? P : never;

export type ElementProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T];

// State management helpers
export type StateSelector<T, R> = (state: T) => R;

export type StateAction<T> = (state: T) => T;

export type StateReducer<T, A> = (state: T, action: A) => T;

// Generic constraint helpers
export type NonNullable<T> = T extends null | undefined ? never : T;

export type NonEmptyArray<T> = [T, ...T[]];

export type AtLeastOne<T> = [T, ...T[]] | T[];

export type OneOf<T extends readonly unknown[]> = T[number];

export type AllOf<T> = T extends readonly (infer U)[] ? U : never; 