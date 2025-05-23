
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook for optimistic task updates in both paginated and non-paginated data structures
 * 
 * @returns Utility function for optimistic updates
 */
export function useOptimisticTaskUpdate() {
  const queryClient = useQueryClient();

  /**
   * Update a task optimistically in the query cache
   * 
   * @param taskId - ID of the task to update
   * @param updates - Object containing the properties to update
   * @param fallbackData - Optional fallback data to use if the update fails
   */
  const updateTaskOptimistically = (
    taskId: string,
    updates: Record<string, any>,
    fallbackData?: any
  ) => {
    queryClient.setQueriesData({ queryKey: ["tasks"] }, (oldData: any) => {
      if (!oldData) return fallbackData || oldData;
      
      // Handle both paginated and non-paginated data structures
      if (oldData.pages) {
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((t: any) => 
              t.id === taskId ? {...t, ...updates} : t
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
              data: oldData.data.data.map((t: any) => 
                t.id === taskId ? {...t, ...updates} : t
              )
            }
          }
        : oldData;
          
      return newData;
    });
  };

  return {
    updateTaskOptimistically
  };
}
