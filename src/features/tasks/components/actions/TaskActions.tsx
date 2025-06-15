// === EXTERNAL LIBRARIES ===
import { Trash2 } from "lucide-react";
import { useCallback, memo, useState } from "react";
import { useNavigate } from "react-router-dom";

// === INTERNAL COMPONENTS ===
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// === HOOKS ===
import { useTaskMutations } from "@/features/tasks/hooks/useTaskMutations";
import { useUnifiedError } from "@/hooks/core/useUnifiedError";
import { useAsyncOperation } from "@/lib/utils/async";
// === TYPES ===
import type { Task } from "@/types";

interface TaskActionsProps {
  task: Task;
  onView: () => void;
  isExpanded?: boolean;
}

function TaskActions({ task, onView, isExpanded = false }: TaskActionsProps) {
  const navigate = useNavigate();
  const { toggleTaskCompleteCallback, deleteTaskCallback } = useTaskMutations();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { handleError, withErrorHandling: _withErrorHandling } = useUnifiedError({ context: 'TaskActions' });
  
  // Async operations using useAsyncOperation for reliable state management
  const {
    execute: executeToggle,
    isLoading: isToggling
  } = useAsyncOperation(
    async () => {
      const result = await toggleTaskCompleteCallback(task);
      if (!result.success && result.error) {
        throw new Error(result.message);
      }
      return result;
    },
    {
      onError: (error) => handleError(error, 'Toggle task completion')
    }
  );
  
  const {
    execute: executeDelete,
    isLoading: isDeleting
  } = useAsyncOperation(
    async () => {
      const result = await deleteTaskCallback(task.id);
      if (!result.success && result.error) {
        throw new Error(result.message);
      }
      setIsDeleteDialogOpen(false);
      return result;
    },
    {
      onError: (error) => handleError(error, 'Delete task')
    }
  );

  const handleCreateFollowUp = useCallback(() => {
    navigate(`/follow-up-task/${task.id}`);
  }, [navigate, task.id]);

  const handleToggleComplete = useCallback(() => {
    executeToggle();
  }, [executeToggle]);

  const handleDelete = useCallback(() => {
    executeDelete();
  }, [executeDelete]);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={task.status === "complete" ? "outline" : "default"}
        size="sm"
        onClick={handleToggleComplete}
        disabled={isToggling}
        className="rounded-full"
      >
        {isToggling ? "Updating..." : (task.status === "complete" ? "Mark Incomplete" : "Complete")}
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleCreateFollowUp}
        className="rounded-full"
      >
        Follow Up
      </Button>
      
      {/* Only show View Details button when not expanded */}
      {!isExpanded && (
        <Button variant="outline" size="sm" onClick={onView}>
          View Details
        </Button>
      )}

      {/* Delete button */}
      <div className="ml-auto">
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:bg-muted hover:text-foreground size-8"
              disabled={isDeleting}
            >
              <Trash2 size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{task.title}&quot;? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => { setIsDeleteDialogOpen(false); }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default memo(TaskActions);
