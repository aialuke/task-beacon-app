
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
          variant={task.status === "complete" ? "outline" : "default"}
          size="sm"
          className={task.status === "complete" ? "" : ""}
          onClick={handleToggleComplete}
          disabled={loading}
        >
          {task.status === "complete" ? "Mark Incomplete" : "Complete"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCreateFollowUp}
          disabled={loading}
        >
          Follow Up
        </Button>
      </div>

      <Dialog open={followUpDialogOpen} onOpenChange={setFollowUpDialogOpen}>
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle className="dialog-title">Create Follow-up Task</DialogTitle>
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
