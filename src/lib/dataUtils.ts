
/**
 * Legacy data utils file - kept for backward compatibility
 * 
 * This file now re-exports from the organized data utility module.
 * For new code, prefer importing directly from "@/lib/utils/data"
 */

// Re-export all data utilities for backward compatibility
export {
  sortByProperty,
  searchByTerm,
  groupBy,
  uniqueBy,
  paginateArray
} from './utils/data';
