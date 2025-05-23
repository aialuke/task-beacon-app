
import { lazy, Suspense } from "react";
import { useTaskContext } from "@/features/tasks/context/TaskContext"; 
import { useUIContext } from "@/contexts/UIContext";
import { useFilteredTasks } from "@/features/tasks/hooks/useFilteredTasks";
import TaskFilter from "./TaskFilter";
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
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="h-8 w-8 rounded-full bg-gray-200" />
    </div>
  </div>
);

export default function TaskList() {
  // Get data and functions from contexts
  const { 
    tasks, 
    isLoading, 
    filter, 
    setFilter,
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
  
  // Always use the hook, never conditionally
  const { isDialogOpen, setDialogOpen } = useUIContext();
  
  // Get filtered tasks
  const filteredTasks = useFilteredTasks(tasks, filter);

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center p-3 mb-1 w-full bg-white rounded-xl shadow-sm">
        <TaskFilter 
          filter={filter}
          onFilterChange={setFilter}
        />
      </div>

      <div className="task-list flex flex-col gap-3">
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
          <div className="flex items-center justify-center p-8 border border-dashed border-gray-300 rounded-xl bg-white/80 text-gray-500">
            <p>No tasks found</p>
          </div>
        )}
      </div>
      
      {/* Pagination Controls */}
      {totalCount > pageSize && (
        <Pagination className="mt-6">
          <PaginationContent className="bg-white shadow-sm rounded-xl p-1">
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => hasPreviousPage && goToPreviousPage()}
                className={!hasPreviousPage ? "pointer-events-none opacity-50 hover:bg-transparent" : "hover:bg-gray-50"}
              />
            </PaginationItem>
            
            <PaginationItem>
              <span className="flex items-center justify-center px-4 text-sm text-gray-700">
                Page {currentPage} of {Math.ceil(totalCount / pageSize)}
              </span>
            </PaginationItem>
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => hasNextPage && goToNextPage()}
                className={!hasNextPage ? "pointer-events-none opacity-50 hover:bg-transparent" : "hover:bg-gray-50"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      {/* Loading indicator for pagination */}
      {isFetching && !isLoading && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-primary/10 text-primary px-4 py-1 rounded-full text-sm shadow-md">
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
              boxShadow: "0 4px 12px rgba(54, 98, 227, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1)",
              border: "none",
              visibility: "visible",
              opacity: 1,
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
          >
            <ClockPlus className="h-6 w-6" strokeWidth={2} stroke="white" fill="none" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-lg border-gray-100">
          <DialogHeader>
            <DialogTitle className="text-gray-800">Create New Task</DialogTitle>
          </DialogHeader>
          <Suspense fallback={<div className="p-4 text-center">Loading form...</div>}>
            <CreateTaskForm onClose={() => setDialogOpen(false)} />
          </Suspense>
        </DialogContent>
      </Dialog>
    </div>
  );
}
