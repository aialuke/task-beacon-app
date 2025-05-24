import { lazy, Suspense } from "react";
import { useTaskContext } from "@/features/tasks/context/TaskContext";
import { useTaskUIContext } from "@/features/tasks/context/TaskUIContext";
import { useUIContext } from "@/contexts/UIContext";
import { useFilteredTasks } from "@/features/tasks/hooks/useFilteredTasks";
import TaskFilterNavbar from "./TaskFilterNavbar";
import { Skeleton } from "@/components/ui/skeleton";
import { ClockPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Lazy load components that aren't needed on initial render
const TaskCard = lazy(() => import("./TaskCard"));
const CreateTaskForm = lazy(() => import("../forms/CreateTaskForm"));

// Skeleton component for lazy-loaded task cards
const TaskCardSkeleton = () => (
  <div className="task-card animate-pulse">
    <div className="h-12 w-12 rounded-full bg-gray-200" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
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
  const { filter, setFilter, isDialogOpen, setDialogOpen } = useTaskUIContext();
  
  // Get filtered tasks
  const filteredTasks = useFilteredTasks(tasks, filter);

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center w-full">
        <TaskFilterNavbar 
          filter={filter}
          onFilterChange={setFilter}
        />
      </div>

      <div className="task-list">
        {isLoading ? (
          Array.from({ length: pageSize }).map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Suspense key={task.id} fallback={<TaskCardSkeleton />}>
              <TaskCard task={task} />
            </Suspense>
          ))
        ) : (
          <div className="flex items-center justify-center p-6 border border-dashed border-gray-300 rounded-xl">
            <p className="text-gray-500">No tasks found</p>
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      {totalCount > pageSize && (
        <Pagination className="mt-4">
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
      )}
      
      {/* Loading indicator for pagination */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary/20 text-primary px-4 py-1 rounded-full text-sm">
          Updating...
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button 
            className="fab" 
            aria-label="Create New Task"
            style={{
              position: "fixed",
              bottom: "16px",
              right: "16px",
              width: "56px",
              height: "56px",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "9999px",
              backgroundColor: "#3662E3",
              color: "white",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)",
              border: "none",
              visibility: "visible",
              opacity: 1
            }}
          >
            <ClockPlus className="h-6 w-6" strokeWidth={2} stroke="white" fill="none" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-card rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create New Task</DialogTitle>
          </DialogHeader>
          <Suspense fallback={<div className="p-4 text-center">Loading form...</div>}>
            <CreateTaskForm onClose={() => setDialogOpen(false)} />
          </Suspense>
        </DialogContent>
      </Dialog>
    </div>
  );
}
