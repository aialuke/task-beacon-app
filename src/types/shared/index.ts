/**
 * Shared Types - Cleaned Legacy Exports
 *
 * Simplified imports from unified type system with legacy compatibility removed.
 */

// Import from unified type system
export type { ApiError } from '@/types';

// Simplified interfaces without legacy compatibility
interface DragItem {
  id: string;
  type: string;
  data: unknown;
}

interface DropTarget {
  id: string;
  accepts: string[];
  onDrop: (item: DragItem) => void;
}

interface ResponseWrapper<T> {
  data: T;
  meta: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

interface Metadata {
  version: string;
  lastModified: string;
  author?: string;
  tags?: string[];
}
