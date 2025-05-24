
import { useTaskContext } from "../context/TaskContext";
import { useTaskUIContext } from "../context/TaskUIContext";
import { useFilteredTasks } from "./useFilteredTasks";

/**
 * Composite hook that combines task data and UI contexts
 * 
 * This hook provides a unified interface for task management,
 * reducing the need for components to directly depend on multiple contexts.
 * Now uses the service layer for business logic.
 * 
 * @returns Combined task management interface
 */
export function useTaskManagement() {
  // Get data context (now focused on data operations)
  const {
    tasks,
    isLoading,
    isFetching,
    error,
    toggleTaskPin,
    toggleTaskComplete,
    createFollowUpTask,
    currentPage,
    totalCount,
    pageSize,
    setPageSize,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage
  } = useTaskContext();

  // Get UI context (focused on UI state)
  const {
    filter,
    setFilter,
    expandedTaskId,
    setExpandedTaskId,
    isDialogOpen,
    setDialogOpen
  } = useTaskUIContext();

  // Apply filtering using service layer
  const filteredTasks = useFilteredTasks(tasks, filter);

  // Task expansion helpers (UI logic)
  const isTaskExpanded = (taskId: string) => expandedTaskId === taskId;
  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  // Dialog helpers (UI logic)
  const openCreateDialog = () => setDialogOpen(true);
  const closeCreateDialog = () => setDialogOpen(false);

  return {
    // Data
    tasks,
    filteredTasks,
    isLoading,
    isFetching,
    error,
    
    // Actions
    toggleTaskPin,
    toggleTaskComplete,
    createFollowUpTask,
    
    // UI State
    filter,
    setFilter,
    expandedTaskId,
    isTaskExpanded,
    toggleTaskExpansion,
    
    // Dialog State
    isDialogOpen,
    openCreateDialog,
    closeCreateDialog,
    
    // Pagination
    currentPage,
    totalCount,
    pageSize,
    setPageSize,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage
  };
}
