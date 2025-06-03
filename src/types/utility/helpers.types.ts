/**
 * TypeScript Helper Types
 * 
 * Comprehensive collection of utility types for TypeScript development.
 * These types help with common patterns and transformations.
 */

// Deep manipulation types
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

// Key extraction types
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

export type OmitByType<T, U> = Pick<T, {
  [K in keyof T]: T[K] extends U ? never : K;
}[keyof T]>;

export type PickByType<T, U> = Pick<T, {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T]>;

// Function types
export type ArgumentTypes<F extends (...args: unknown[]) => unknown> = F extends (...args: infer A) => unknown ? A : never;

export type ReturnTypeAsync<T extends (...args: unknown[]) => Promise<unknown>> = T extends (...args: unknown[]) => Promise<infer R> ? R : never;

export type FirstArgument<T> = T extends (arg1: infer U, ...args: unknown[]) => unknown ? U : never;

export type LastArgument<T extends (...args: unknown[]) => unknown> = T extends (...args: [...unknown[], infer L]) => unknown ? L : never;

// Array manipulation types
export type Head<T extends readonly unknown[]> = T extends readonly [infer H, ...unknown[]] ? H : never;

export type Tail<T extends readonly unknown[]> = T extends readonly [unknown, ...infer Rest] ? Rest : [];

export type Last<T extends readonly unknown[]> = T extends readonly [...unknown[], infer L] ? L : never;

export type Length<T extends readonly unknown[]> = T['length'];

export type Reverse<T extends readonly unknown[]> = T extends readonly [...infer Rest, infer L] ? [L, ...Reverse<Rest>] : [];

export type Flatten<T extends readonly unknown[]> = T extends readonly [infer F, ...infer Rest] 
  ? F extends readonly unknown[] 
    ? [...Flatten<F>, ...Flatten<Rest>] 
    : [F, ...Flatten<Rest>]
  : [];

// String manipulation types
export type Split<S extends string, D extends string> = S extends `${infer T}${D}${infer U}` ? [T, ...Split<U, D>] : [S];

export type Join<T extends readonly string[], D extends string> = T extends readonly [infer F, ...infer Rest]
  ? F extends string
    ? Rest extends readonly string[]
      ? Rest['length'] extends 0
        ? F
        : `${F}${D}${Join<Rest, D>}`
      : never
    : never
  : '';

export type Capitalize<S extends string> = S extends `${infer F}${infer Rest}` ? `${Uppercase<F>}${Rest}` : S;

export type Uncapitalize<S extends string> = S extends `${infer F}${infer Rest}` ? `${Lowercase<F>}${Rest}` : S;

export type CamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${Lowercase<P1>}${Uppercase<P2>}${CamelCase<P3>}`
  : Lowercase<S>;

export type SnakeCase<S extends string> = S extends `${infer C}${infer T}`
  ? `${C extends Capitalize<C> ? '_' : ''}${Lowercase<C>}${SnakeCase<T>}`
  : S;

// Conditional types
export type If<C extends boolean, T, F> = C extends true ? T : F;

export type IsAny<T> = 0 extends 1 & T ? true : false;

export type IsNever<T> = [T] extends [never] ? true : false;

export type IsUnknown<T> = IsAny<T> extends true ? false : unknown extends T ? true : false;

export type IsEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;

export type IsArray<T> = T extends readonly unknown[] ? true : false;

export type IsFunction<T> = T extends (...args: unknown[]) => unknown ? true : false;

export type IsObject<T> = T extends object ? (T extends unknown[] ? false : true) : false;

// Brand types
export type Brand<K, T> = K & { __brand: T };

export type Branded<T, B> = T & { __brand: B };

export type Unbrand<T> = T extends Brand<infer K, unknown> ? K : T;

// Event types
export type EventMap = Record<string, unknown>;

export type EventHandler<T = unknown> = (event: T) => void;

export type EventHandlers<T extends EventMap> = {
  [K in keyof T]: EventHandler<T[K]>;
};

// Promise types
export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export type PromiseType<T extends Promise<unknown>> = T extends Promise<infer U> ? U : never;

export type MaybePromise<T> = T | Promise<T>;

export type PromiseValue<T> = T extends Promise<infer U> ? U : T;

// JSON types
export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export type JsonObject = { [key: string]: JsonValue };

export type JsonArray = JsonValue[];

export type Jsonifiable<T> = {
  [K in keyof T]: T[K] extends JsonValue ? T[K] : never;
};

// Path types
export type Path<T> = T extends object ? {
  [K in keyof T]: K extends string | number ? K | `${K}.${Path<T[K]>}` : never;
}[keyof T] : never;

export type PathValue<T, P extends Path<T>> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Path<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

export type SetPath<T, P extends string, V> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? { [Key in keyof T]: Key extends K ? SetPath<T[Key], Rest, V> : T[Key] }
    : T & { [Key in K]: SetPath<Record<string, never>, Rest, V> }
  : { [Key in keyof T | P]: Key extends P ? V : Key extends keyof T ? T[Key] : never };

// Database types
export type TableInsert<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;

export type TableUpdate<T> = Partial<Omit<T, 'id' | 'created_at'>>;

// API types
export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
};

export type QueryParams = Record<string, string | number | boolean | undefined>;

// Validation types
export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export type FormErrors<T> = ValidationErrors<T>;

// Component types
export type PropsWithClassName<P = Record<string, never>> = P & { className?: string };

export type PropsWithChildren<P = Record<string, never>> = P & { children?: React.ReactNode };

export type ComponentProps<T extends React.ComponentType<unknown>> = T extends React.ComponentType<infer P> ? P : never;

export type ElementProps<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T];

// State types
export type StateSelector<T, R> = (state: T) => R;

export type StateAction<T> = T | ((prevState: T) => T);

export type StateReducer<T, A> = (state: T, action: A) => T;

// Utility types
export type NonNullable<T> = T extends null | undefined ? never : T;

export type NonEmptyArray<T> = [T, ...T[]];

export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export type OneOf<T extends readonly unknown[]> = T[number];

export type AllOf<T extends readonly unknown[]> = T extends readonly [infer First, ...infer Rest]
  ? First & AllOf<Rest>
  : Record<string, never>;
