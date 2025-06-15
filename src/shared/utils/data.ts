
/**
 * Data Utilities
 * Common utilities for data manipulation and processing
 */

// ============================================================================
// ARRAY UTILITIES
// ============================================================================

/**
 * Remove duplicate items from array based on a key
 */
export function uniqueBy<T>(array: T[], keyFn: (item: T) => any): T[] {
  const seen = new Set();
  return array.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

/**
 * Group array items by a key
 */
export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array by multiple criteria
 */
export function sortBy<T>(
  array: T[],
  ...criteria: Array<(item: T) => any>
): T[] {
  return [...array].sort((a, b) => {
    for (const criterion of criteria) {
      const aVal = criterion(a);
      const bVal = criterion(b);
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
    }
    return 0;
  });
}

/**
 * Chunk array into smaller arrays of specified size
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) return [];
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// ============================================================================
// OBJECT UTILITIES
// ============================================================================

/**
 * Pick specific keys from an object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omit specific keys from an object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

/**
 * Deep merge two objects
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };
  
  Object.keys(source).forEach(key => {
    const sourceValue = source[key as keyof T];
    const targetValue = result[key as keyof T];
    
    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      (result as any)[key] = deepMerge(targetValue as Record<string, any>, sourceValue as Record<string, any>);
    } else {
      (result as any)[key] = sourceValue;
    }
  });
  
  return result;
}

// ============================================================================
// TYPE UTILITIES
// ============================================================================

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: unknown): value is null | undefined | '' | [] | {} {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Check if value is not empty
 */
export function isNotEmpty<T>(value: T): value is NonNullable<T> {
  return !isEmpty(value);
}

/**
 * Type-safe Object.keys
 */
export function typedKeys<T extends Record<string, any>>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * Type-safe Object.entries
 */
export function typedEntries<T extends Record<string, any>>(
  obj: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate required fields in an object
 */
export function validateRequired<T extends Record<string, any>>(
  obj: T,
  requiredFields: Array<keyof T>
): { isValid: boolean; missingFields: Array<keyof T> } {
  const missingFields = requiredFields.filter(field => isEmpty(obj[field]));
  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Clean object by removing empty values
 */
export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {};
  
  typedEntries(obj).forEach(([key, value]) => {
    if (isNotEmpty(value)) {
      cleaned[key] = value;
    }
  });
  
  return cleaned;
}

// ============================================================================
// TRANSFORMATION UTILITIES
// ============================================================================

/**
 * Convert object keys to camelCase
 */
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert object keys to snake_case
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Transform object keys using a transformation function
 */
export function transformKeys<T extends Record<string, any>>(
  obj: T,
  transformer: (key: string) => string
): Record<string, any> {
  const transformed: Record<string, any> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    const newKey = transformer(key);
    transformed[newKey] = value;
  });
  
  return transformed;
}

// ============================================================================
// PAGINATION UTILITIES
// ============================================================================

/**
 * Calculate pagination info
 */
export function calculatePagination(
  total: number,
  page: number,
  pageSize: number
) {
  const totalPages = Math.ceil(total / pageSize);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  return {
    total,
    page,
    pageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    itemsOnPage: endIndex - startIndex,
  };
}

/**
 * Get paginated slice of array
 */
export function paginateArray<T>(
  array: T[],
  page: number,
  pageSize: number
): T[] {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return array.slice(startIndex, endIndex);
}
