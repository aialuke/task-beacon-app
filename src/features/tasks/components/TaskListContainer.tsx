
import { useTaskContext } from "@/features/tasks/context/TaskContext";
import { useTaskUIContext } from "@/features/tasks/context/TaskUIContext";
import { useFilteredTasks } from "@/features/tasks/hooks/useFilteredTasks";
import TaskFilterNavbar from "./TaskFilterNavbar";
import TaskListRenderer from "./TaskListRenderer";
import TaskPagination from "./TaskPagination";
import CreateTaskDialog from "./CreateTaskDialog";

export default function TaskListContainer() {
  console.log("[TaskListContainer] Rendering");
  
  // Use contexts directly instead of composite hook
  const {
    tasks,
    isLoading,
    isFetching,
    currentPage,
    totalCount,
    pageSize,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage
  } = useTaskContext();

  const {
    filter,
    setFilter,
    isDialogOpen,
    setDialogOpen
  } = useTaskUIContext();

  console.log("[TaskListContainer] Tasks count:", tasks?.length || 0);
  console.log("[TaskListContainer] Filter:", filter);

  // Apply filtering using service layer
  const filteredTasks = useFilteredTasks(tasks, filter);

  console.log("[TaskListContainer] Filtered tasks count:", filteredTasks?.length || 0);

  const closeCreateDialog = () => setDialogOpen(false);

  return (
    <>
      {/* Navbar Section */}
      <div className="w-full mb-8 px-4 sm:px-6">
        <TaskFilterNavbar 
          filter={filter}
          onFilterChange={setFilter}
        />
      </div>

      {/* Task List Section */}
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
