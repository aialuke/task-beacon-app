
// src/components/TaskActions.tsx
import { useState, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "@/lib/toast"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FollowUpTaskForm from "./FollowUpTaskForm";

interface TaskActionsProps {
  task: Task;
  detailView?: boolean;
}

function TaskActions({ task, detailView }: TaskActionsProps) {
  const [loading, setLoading] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);

  const handleMarkComplete = useCallback(async () => {
    setLoading(true);
    try {
      if (isMockingSupabase) {
        toast.success(`Task marked ${task.status === "complete" ? "incomplete" : "complete"} (mock)`);
        setTimeout(() => setLoading(false), 500);
        return;
      }

      const { error } = await supabase
        .from("tasks")
        .update({ status: task.status === "complete" ? "pending" : "complete" })
        .eq("id", task.id);

      if (error) throw error;
      toast.success(`Task marked ${task.status === "complete" ? "incomplete" : "complete"}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [task.status, task.id]);

  const handleCreateFollowUp = useCallback(() => {
    setFollowUpDialogOpen(true);
  }, []);

  return (
    <>
      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
        <Button
          variant={task.status === "complete" ? "outline" : "default"}
          size="sm"
          className="text-xs rounded-full"
          onClick={handleMarkComplete}
          disabled={loading}
        >
          {task.status === "complete" ? "Mark Incomplete" : "Complete"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs rounded-full"
          onClick={handleCreateFollowUp}
          disabled={loading}
        >
          Follow Up
        </Button>
      </div>

      <Dialog open={followUpDialogOpen} onOpenChange={setFollowUpDialogOpen}>
        <DialogContent className="max-w-lg bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create Follow-up Task</DialogTitle>
          </DialogHeader>
          <FollowUpTaskForm
            parentTask={task}
            onClose={() => setFollowUpDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(TaskActions);
