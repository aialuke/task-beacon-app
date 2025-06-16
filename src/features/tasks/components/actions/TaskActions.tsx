import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
import { TaskService } from '@/lib/api/tasks';
import type { Task } from '@/types';

interface TaskActionsProps {
  task: Task;
  onView: () => void;
  isExpanded?: boolean;
}

function TaskActions({ task, onView, isExpanded = false }: TaskActionsProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: toggleTaskComplete, isPending: isToggling } = useMutation({
    mutationFn: () => {
      const newStatus = task.status === 'complete' ? 'pending' : 'complete';
      return TaskService.status.updateStatus(task.id, newStatus);
    },
    onSuccess: ({ data: updatedTask }) => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(
        `Task marked as ${
          updatedTask.status === 'complete' ? 'complete' : 'incomplete'
        }`
      );
    },
    onError: error => {
      toast.error(`Error updating task: ${error.message}`);
    },
  });

  const { mutate: deleteTask, isPending: isDeleting } = useMutation({
    mutationFn: () => TaskService.crud.delete(task.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted successfully');
      setIsDeleteDialogOpen(false);
    },
    onError: error => {
      toast.error(`Error deleting task: ${error.message}`);
    },
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCreateFollowUp = useCallback(() => {
    navigate(`/follow-up-task/${task.id}`);
  }, [navigate, task.id]);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={task.status === 'complete' ? 'outline' : 'default'}
        size="sm"
        onClick={() => toggleTaskComplete()}
        disabled={isToggling}
        className="rounded-full"
      >
        {isToggling
          ? 'Updating...'
          : task.status === 'complete'
            ? 'Mark Incomplete'
            : 'Complete'}
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
                onClick={() => deleteTask()}
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
