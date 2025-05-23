
// Move from src/contexts/task/useTaskMutations.ts
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/lib/types";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "@/lib/toast";

export function useTaskMutations() {
  const queryClient = useQueryClient();

  // Task pin mutation
  const toggleTaskPin = async (task: Task) => {
    const newPinnedState = !task.pinned;
    
    try {
      if (isMockingSupabase) {
        // Optimistic update for mock mode
        queryClient.setQueryData(["tasks"], (oldData: Task[] | undefined) => 
          oldData ? oldData.map(t => t.id === task.id ? {...t, pinned: newPinnedState} : t) : []
        );
        toast.success(`Task ${task.pinned ? "unpinned" : "pinned"} successfully (mock)`);
        return;
      }

      // Optimistic update
      queryClient.setQueryData(["tasks"], (oldData: Task[] | undefined) => 
        oldData ? oldData.map(t => t.id === task.id ? {...t, pinned: newPinnedState} : t) : []
      );

      const { error } = await supabase
        .from("tasks")
        .update({ pinned: newPinnedState })
        .eq("id", task.id);

      if (error) throw error;
      toast.success(`Task ${task.pinned ? "unpinned" : "pinned"} successfully`);
    } catch (error: unknown) {
      // Rollback optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  // Task complete mutation
  const toggleTaskComplete = async (task: Task) => {
    const newStatus = task.status === "complete" ? "pending" : "complete";
    
    try {
      if (isMockingSupabase) {
        // Optimistic update for mock mode
        queryClient.setQueryData(["tasks"], (oldData: Task[] | undefined) => 
          oldData ? oldData.map(t => t.id === task.id ? {...t, status: newStatus} : t) : []
        );
        toast.success(`Task marked ${task.status === "complete" ? "incomplete" : "complete"} (mock)`);
        return;
      }

      // Optimistic update
      queryClient.setQueryData(["tasks"], (oldData: Task[] | undefined) => 
        oldData ? oldData.map(t => t.id === task.id ? {...t, status: newStatus} : t) : []
      );

      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", task.id);

      if (error) throw error;
      toast.success(`Task marked ${task.status === "complete" ? "incomplete" : "complete"}`);
    } catch (error: unknown) {
      // Rollback optimistic update on error
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  // Create follow-up task
  const createFollowUpTask = async (parentTask: Task, newTaskData: any) => {
    try {
      if (isMockingSupabase) {
        toast.success("Follow-up task created successfully (mock)");
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("User not authenticated");
      
      const { error } = await supabase
        .from("tasks")
        .insert({
          ...newTaskData,
          owner_id: user.id,
          parent_task_id: parentTask.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      toast.success("Follow-up task created successfully");
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
