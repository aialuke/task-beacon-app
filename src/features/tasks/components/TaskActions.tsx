
import { useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { useTaskContext } from "../context/TaskContext";
import { useTaskCompletionToggle } from "../hooks/useTaskCompletionToggle";

interface TaskActionsProps {
  task: Task;
  detailView?: boolean;
}

function TaskActions({ task, detailView }: TaskActionsProps) {
  const navigate = useNavigate();
  const { toggleTaskComplete } = useTaskContext();
  const { loading, handleToggleComplete } = useTaskCompletionToggle(task, toggleTaskComplete);
  
  const handleCreateFollowUp = useCallback(() => {
    navigate(`/follow-up-task/${task.id}`);
  }, [navigate, task.id]);

  return (
    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
      <Button
        variant={task.status === "complete" ? "outline" : "default"}
        size="sm"
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
  );
}

export default memo(TaskActions);
