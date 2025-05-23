
import { QueryClient } from "@tanstack/react-query";
import { Task } from "@/lib/types";

type UpdateFunction<T> = (task: Task, newValue: T) => Task;

/**
 * Utility function for performing optimistic updates on tasks
 * 
 * @param queryClient - React Query client instance
 * @param task - The task to update
 * @param updateFn - Function that returns the updated task
 * @param fieldName - Name of the field being updated (for logging)
 * @param newValue - New value for the field
 */
export function performOptimisticUpdate<T>(
  queryClient: QueryClient,
  task: Task,
  updateFn: UpdateFunction<T>,
  fieldName: string,
  newValue: T
) {
  // Store previous state for rollback
  const previousTasks = queryClient.getQueryData<any>(["tasks", undefined, undefined]);
  
  // Optimistic update
  queryClient.setQueriesData({ queryKey: ["tasks"] }, (oldData: any) => {
    if (!oldData) return oldData;
    
    // Handle both paginated and non-paginated data structures
    if (oldData.pages) {
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((t: Task) => 
            t.id === task.id ? updateFn(t, newValue) : t
          )
        }))
      };
    }
    
    // Handle regular data structure
    const newData = oldData.data 
      ? {
          ...oldData,
          data: {
            ...oldData.data,
            data: oldData.data.data.map((t: Task) => 
              t.id === task.id ? updateFn(t, newValue) : t
            )
          }
        }
      : oldData;
        
    return newData;
  });

  return { previousTasks };
}

/**
 * Utility function for rolling back optimistic updates on failure
 * 
 * @param queryClient - React Query client instance
 * @param task - The original task
 * @param previousTasks - Previous state for rollback
 */
export function rollbackOptimisticUpdate(
  queryClient: QueryClient,
  task: Task,
  previousTasks: any
) {
  queryClient.setQueriesData({ queryKey: ["tasks"] }, (oldData: any) => {
    if (!oldData) return previousTasks || oldData;
    
    // Handle both paginated and non-paginated data structures
    if (oldData.pages) {
      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((t: Task) => 
            t.id === task.id ? { ...task } : t
          )
        }))
      };
    }
    
    // Handle regular data structure
    const newData = oldData.data 
      ? {
          ...oldData,
          data: {
            ...oldData.data,
            data: oldData.data.data.map((t: Task) => 
              t.id === task.id ? { ...task } : t
            )
          }
        }
      : oldData;
        
    return newData;
  });
}
