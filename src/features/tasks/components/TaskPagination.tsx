import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface TaskPaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  isFetching: boolean;
  isLoading: boolean;
}

export default function TaskPagination({
  currentPage,
  totalCount,
  pageSize,
  hasNextPage,
  hasPreviousPage,
  goToNextPage,
  goToPreviousPage,
  isFetching,
  isLoading,
}: TaskPaginationProps) {
  if (totalCount <= pageSize) {
    return null;
  }

  return (
    <>
      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => hasPreviousPage && goToPreviousPage()}
                className={
                  !hasPreviousPage ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>

            <PaginationItem>
              <span className="flex items-center justify-center px-4">
                Page {currentPage} of {Math.ceil(totalCount / pageSize)}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() => hasNextPage && goToNextPage()}
                className={!hasNextPage ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Loading indicator for pagination */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 transform rounded-full bg-primary/20 px-4 py-1 text-sm text-primary">
          Updating...
        </div>
      )}
    </>
  );
}
// CodeRabbit review
