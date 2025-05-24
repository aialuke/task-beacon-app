
import { useTaskManagement } from "@/features/tasks/hooks/useTaskManagement";
import TaskFilterNavbar from "./TaskFilterNavbar";
import TaskListRenderer from "./TaskListRenderer";
import TaskPagination from "./TaskPagination";
import CreateTaskDialog from "./CreateTaskDialog";

export default function TaskListContainer() {
  // Use composite hook instead of direct context dependencies
  const { 
    filteredTasks,
    isLoading, 
    isFetching,
    filter,
    setFilter,
    isDialogOpen,
    closeCreateDialog,
    // Pagination props
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    currentPage,
    totalCount,
    pageSize
  } = useTaskManagement();

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
        <TaskListRenderer 
          filteredTasks={filteredTasks}
          isLoading={isLoading}
          pageSize={pageSize}
        />
        
        <TaskPagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          isFetching={isFetching}
          isLoading={isLoading}
        />
      </div>

      <CreateTaskDialog 
        isDialogOpen={isDialogOpen}
        setDialogOpen={closeCreateDialog}
      />
    </>
  );
}
