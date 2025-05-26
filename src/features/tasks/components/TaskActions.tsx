
import { useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { useTaskContext } from "../context/TaskContext";
import { useTaskOperations } from "../hooks/useTaskOperations";

interface TaskActionsProps {
  task: Task;
  detailView?: boolean;
}

function TaskActions({ task, detailView }: TaskActionsProps) {
  const navigate = useNavigate();
  const { createFollowUpTask } = useTaskContext();
  const { handleToggleComplete, completionLoading } = useTaskOperations(task);
  
  const handleCreateFollowUp = useCallback(() => {
    navigate(`/follow-up-task/${task.id}`);
  }, [navigate, task.id]);

  return (
    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
      <Button
        variant={task.status === "complete" ? "outline" : "default"}
        size="sm"
        onClick={handleToggleComplete}
        disabled={completionLoading}
      >
        {task.status === "complete" ? "Mark Incomplete" : "Complete"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleCreateFollowUp}
        disabled={completionLoading}
      >
        Follow Up
      </Button>
    </div>
  );
}

export default memo(TaskActions);
