import GenericPagination from '@/shared/components/ui/GenericPagination';
import type { PaginationAPI } from '@/types/pagination.types';

interface TaskPaginationProps {
  pagination: Pick<
    PaginationAPI,
    | 'currentPage'
    | 'totalPages'
    | 'hasNextPage'
    | 'hasPreviousPage'
    | 'goToNextPage'
    | 'goToPreviousPage'
    | 'goToPage'
  >;
  totalCount: number;
  pageSize: number;
  isFetching: boolean;
  isLoading: boolean;
}

/**
 * Task-specific pagination component - Phase 3 Refactored
 *
 * Now uses the generic pagination component, eliminating complex prop threading.
 * Reduced from 8 props to a clean pagination object.
 */
export default function TaskPagination({
  pagination,
  totalCount,
  pageSize,
  isFetching,
  isLoading,
}: TaskPaginationProps) {
  return (
    <GenericPagination
      pagination={pagination}
      totalCount={totalCount}
      pageSize={pageSize}
      showInfo={true}
      showPageNumbers={false}
      isFetching={isFetching}
      isLoading={isLoading}
      className="mt-8"
    />
  );
}
