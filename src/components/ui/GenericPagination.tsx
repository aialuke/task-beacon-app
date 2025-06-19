import { memo, useMemo } from 'react';

import type { PaginationAPI } from '@/types/pagination.types';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
} from './pagination';

interface GenericPaginationProps {
  pagination: PaginationAPI;
  totalCount: number;
  showInfo?: boolean;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  isLoading?: boolean;
  isFetching?: boolean;
  className?: string;
}

/**
 * Generic Pagination Component - Phase 2 Implementation
 *
 * Reusable pagination component that works with any data type.
 * Replaces task-specific pagination components.
 */
function GenericPaginationComponent({
  pagination,
  totalCount,
  pageSize,
  showInfo = true,
  showPageNumbers = true,
  maxVisiblePages = 5,
  isLoading = false,
  isFetching = false,
  className,
}: GenericPaginationProps) {
  const {
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
  } = pagination;

  // Don't render if there's only one page or less
  if (totalCount <= (pagination.pageSize || 10)) {
    return null;
  }

  // Memoized visible page numbers calculation
  const visiblePages = useMemo(() => {
    if (!showPageNumbers) return [];

    const pages: (number | 'ellipsis')[] = [];
    const half = Math.floor(maxVisiblePages / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    // Adjust if we're near the beginning or end
    if (currentPage <= half) {
      end = Math.min(totalPages, maxVisiblePages);
    } else if (currentPage + half >= totalPages) {
      start = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('ellipsis');
      }
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('ellipsis');
      }
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages, maxVisiblePages, showPageNumbers]);

  return (
    <div className={className}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={hasPreviousPage ? goToPreviousPage : undefined}
              className={
                !hasPreviousPage
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {showPageNumbers &&
            visiblePages.map((page, index) => (
              <PaginationItem key={index}>
                {page === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => goToPage(page as number)}
                    isActive={page === currentPage}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

          {!showPageNumbers && (
            <PaginationItem>
              <span className="flex items-center justify-center px-4">
                Page {currentPage} of {totalPages}
              </span>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={hasNextPage ? goToNextPage : undefined}
              className={
                !hasNextPage
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Optional info display */}
      {showInfo && (
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)} to{' '}
          {Math.min(currentPage * pageSize, totalCount)} of {totalCount} items
        </div>
      )}

      {/* Loading indicator */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 transform rounded-full bg-primary/20 px-4 py-1 text-sm text-primary">
          Updating...
        </div>
      )}
    </div>
  );
}

export default memo(GenericPaginationComponent);
