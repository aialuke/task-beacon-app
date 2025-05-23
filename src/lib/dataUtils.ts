
/**
 * Data manipulation utilities
 * 
 * This file contains utilities for data transformation, filtering, and manipulation.
 */

/**
 * Sorts an array of objects by a specific property
 * 
 * @param array - The array to sort
 * @param key - The property to sort by
 * @param direction - Sort direction ('asc' or 'desc')
 * @returns A new sorted array
 */
export function sortByProperty<T>(
  array: T[], 
  key: keyof T, 
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const valueA = a[key];
    const valueB = b[key];
    
    // Handle string comparison
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    // Handle number comparison
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return direction === 'asc' 
        ? valueA - valueB 
        : valueB - valueA;
    }
    
    // Handle date comparison
    if (valueA instanceof Date && valueB instanceof Date) {
      return direction === 'asc' 
        ? valueA.getTime() - valueB.getTime() 
        : valueB.getTime() - valueA.getTime();
    }
    
    // Default comparison
    return 0;
  });
}

/**
 * Groups an array of objects by a specific property
 * 
 * @param array - The array to group
 * @param key - The property to group by
 * @returns An object with keys representing each group and values as arrays of matching items
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Removes duplicate items from an array based on a property
 * 
 * @param array - The array to process
 * @param key - The property to check for duplicates
 * @returns A new array with duplicates removed
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Creates a paginated subset of an array
 * 
 * @param array - The array to paginate
 * @param page - The page number (1-based)
 * @param pageSize - Number of items per page
 * @returns A subset of the array for the specified page
 */
export function paginateArray<T>(array: T[], page: number = 1, pageSize: number = 10): T[] {
  const startIndex = (page - 1) * pageSize;
  return array.slice(startIndex, startIndex + pageSize);
}

/**
 * Filters an array of objects based on a search term across multiple properties
 * 
 * @param array - The array to search
 * @param searchTerm - The term to search for
 * @param keys - The properties to search within
 * @returns Filtered array of items that match the search term
 */
export function searchByTerm<T>(array: T[], searchTerm: string, keys: (keyof T)[]): T[] {
  if (!searchTerm) return array;
  
  const term = searchTerm.toLowerCase().trim();
  
  return array.filter(item => 
    keys.some(key => {
      const value = item[key];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(term);
    })
  );
}

