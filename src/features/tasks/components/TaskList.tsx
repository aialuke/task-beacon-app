
import { lazy, Suspense } from "react";
import { useTaskContext } from "@/features/tasks/context/TaskContext";
import { useTaskUIContext } from "@/features/tasks/context/TaskUIContext";
import { useFilteredTasks } from "@/features/tasks/hooks/useFilteredTasks";
import TaskFilterNavbar from "./TaskFilterNavbar";
import { Skeleton } from "@/components/ui/skeleton";
import { FabButton } from "@/components/FabButton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Lazy load components that aren't needed on initial render
const TaskCard = lazy(() => import("./TaskCard"));

// Skeleton component for lazy-loaded task cards
const TaskCardSkeleton = () => (
  <div className="animate-pulse p-4 sm:p-5 rounded-xl bg-muted/20 border-2 border-border/40">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  </div>
);

export default function TaskList() {
  // Get data and functions from contexts
  const { 
    tasks, 
    isLoading, 
    isFetching,
    // Pagination props
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    currentPage,
    totalCount,
    pageSize
  } = useTaskContext();
  
  // Get UI state from TaskUIContext
  const { filter, setFilter } = useTaskUIContext();
  
  // Get filtered tasks
  const filteredTasks = useFilteredTasks(tasks, filter);

  return (
    <>
      {/* Navbar Section - Completely isolated */}
      <div className="w-full mb-8 px-4 sm:px-6">
        <TaskFilterNavbar 
          filter={filter}
          onFilterChange={setFilter}
        />
      </div>

      {/* Task List Section - Completely isolated with no shared containers */}
      <div className="w-full px-4 sm:px-6">
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: pageSize }).map((_, i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="space-y-6">
            {filteredTasks.map((task) => (
              <Suspense key={task.id} fallback={<TaskCardSkeleton />}>
                <TaskCard task={task} />
              </Suspense>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 border-2 border-dashed border-border/60 rounded-xl bg-muted/20">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        )}
        
        {/* Pagination Controls */}
        {totalCount > pageSize && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => hasPreviousPage && goToPreviousPage()}
                    className={!hasPreviousPage ? "pointer-events-none opacity-50" : ""}
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
                    className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        
        {/* Loading indicator for pagination */}
        {isFetching && !isLoading && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary/20 text-primary px-4 py-1 rounded-full text-sm">
            Updating...
          </div>
        )}
      </div>

      {/* Create Task FAB */}
      <FabButton />
    </>
  );
}
