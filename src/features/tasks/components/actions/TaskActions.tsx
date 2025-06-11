import { Trash2 } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTaskMutations } from '@/features/tasks/hooks/useTaskMutations';
import type { Task } from '@/types';

interface TaskActionsProps {
  task: Task;
  onView: () => void;
  isExpanded?: boolean;
}

function TaskActions({ task, onView, isExpanded = false }: TaskActionsProps) {
  const navigate = useNavigate();
  const { toggleTaskCompleteCallback, deleteTaskCallback } = useTaskMutations();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCreateFollowUp = useCallback(() => {
    navigate(`/follow-up-task/${task.id}`);
  }, [navigate, task.id]);

  const handleToggleComplete = useCallback(async () => {
    const result = await toggleTaskCompleteCallback(task);
    if (result.success) {
      // toast.success(result.message);
    } else if (result.error) {
      // toast.error(result.message);
    }
  }, [toggleTaskCompleteCallback, task]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTaskCallback(task.id);
      if (result.success) {
        // toast.success(result.message);
        setIsDeleteDialogOpen(false);
      } else if (result.error) {
        // toast.error(result.message);
      }
    } catch {
      // toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTaskCallback, task.id]);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={task.status === 'complete' ? 'outline' : 'default'}
        size="sm"
        onClick={handleToggleComplete}
        className="rounded-full"
      >
        {task.status === 'complete' ? 'Mark Incomplete' : 'Complete'}
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
              className="size-8 text-muted-foreground hover:bg-muted hover:text-foreground"
              disabled={isDeleting}
            >
              <Trash2 size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &ldquo;{task.title}&rdquo;? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default memo(TaskActions);
