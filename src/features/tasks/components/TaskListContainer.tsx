
import { useTaskContext } from "@/features/tasks/context/TaskContext";
import { useTaskUIContext } from "@/features/tasks/context/TaskUIContext";
import { useFilteredTasks } from "@/features/tasks/hooks/useFilteredTasks";
import TaskFilterNavbar from "./TaskFilterNavbar";
import TaskListRenderer from "./TaskListRenderer";
import TaskPagination from "./TaskPagination";
import CreateTaskDialog from "./CreateTaskDialog";

export default function TaskListContainer() {
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
        setDialogOpen={setDialogOpen}
      />
    </>
  );
}
