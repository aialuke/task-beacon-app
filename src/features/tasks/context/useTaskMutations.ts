
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/lib/types";
import { toast } from "@/lib/toast";
import { 
  toggleTaskPin as apiToggleTaskPin, 
  updateTaskStatus, 
  createFollowUpTask as apiCreateFollowUpTask 
} from "@/integrations/supabase/api/tasks.api";

/**
 * Hook for task mutation operations
 * 
 * Provides optimistic updates with targeted error recovery
 * 
 * @returns Object containing task mutation functions
 */
export function useTaskMutations() {
  const queryClient = useQueryClient();

  // Task pin mutation with targeted recovery
  const toggleTaskPin = async (task: Task) => {
    const newPinnedState = !task.pinned;
    const previousTasks = queryClient.getQueryData<any>(
      ["tasks", undefined, undefined]
    );
    
    try {
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
                t.id === task.id ? {...t, pinned: newPinnedState} : t
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
                  t.id === task.id ? {...t, pinned: newPinnedState} : t
                )
              }
            }
          : oldData;
            
        return newData;
      });

      const { error } = await apiToggleTaskPin(task.id, newPinnedState);

      if (error) throw error;
      toast.success(`Task ${task.pinned ? "unpinned" : "pinned"} successfully`);
    } catch (error: unknown) {
      // Targeted rollback only for this specific task
      queryClient.setQueriesData({ queryKey: ["tasks"] }, (oldData: any) => {
        if (!oldData) return previousTasks || oldData;
        
        // Handle both paginated and non-paginated data structures
        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((t: Task) => 
                t.id === task.id ? {...t, pinned: task.pinned} : t
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
                  t.id === task.id ? {...t, pinned: task.pinned} : t
                )
              }
            }
          : oldData;
            
        return newData;
      });
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  // Task complete mutation with targeted recovery
  const toggleTaskComplete = async (task: Task) => {
    const newStatus = task.status === "complete" ? "pending" : "complete";
    const previousTasks = queryClient.getQueryData<any>(
      ["tasks", undefined, undefined]
    );
    
    try {
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
                t.id === task.id ? {...t, status: newStatus} : t
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
                  t.id === task.id ? {...t, status: newStatus} : t
                )
              }
            }
          : oldData;
            
        return newData;
      });

      const { error } = await updateTaskStatus(task.id, newStatus);

      if (error) throw error;
      toast.success(`Task marked ${task.status === "complete" ? "incomplete" : "complete"}`);
    } catch (error: unknown) {
      // Targeted rollback only for this specific task
      queryClient.setQueriesData({ queryKey: ["tasks"] }, (oldData: any) => {
        if (!oldData) return previousTasks || oldData;
        
        // Handle both paginated and non-paginated data structures
        if (oldData.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.map((t: Task) => 
                t.id === task.id ? {...t, status: task.status} : t
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
                  t.id === task.id ? {...t, status: task.status} : t
                )
              }
            }
          : oldData;
            
        return newData;
      });
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  // Create follow-up task with query invalidation
  const createFollowUpTask = async (parentTask: Task, newTaskData: any) => {
    try {
      const { error } = await apiCreateFollowUpTask(parentTask.id, newTaskData);

      if (error) throw error;
      
      toast.success("Follow-up task created successfully");
      // Selectively invalidate task queries
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return {
    toggleTaskPin,
    toggleTaskComplete,
    createFollowUpTask
  };
}
