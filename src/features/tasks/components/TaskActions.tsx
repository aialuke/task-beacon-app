
import { useState, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FollowUpTaskForm from "../forms/FollowUpTaskForm";
import { useTaskContext } from "../context/TaskContext";
import { useTaskCompletionToggle } from "../hooks/useTaskCompletionToggle";

interface TaskActionsProps {
  task: Task;
  detailView?: boolean;
}

function TaskActions({ task, detailView }: TaskActionsProps) {
  const { toggleTaskComplete } = useTaskContext();
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const { loading, handleToggleComplete } = useTaskCompletionToggle(task, toggleTaskComplete);
  
  const handleCreateFollowUp = useCallback(() => {
    setFollowUpDialogOpen(true);
  }, []);

  return (
    <>
      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
        <Button
          variant={task.status === "complete" ? "outline" : "brand"}
          size="sm"
          className={task.status === "complete" ? "" : "force-primary-button text-xs"}
          onClick={handleToggleComplete}
          disabled={loading}
        >
          {task.status === "complete" ? "Mark Incomplete" : "Complete"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
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
