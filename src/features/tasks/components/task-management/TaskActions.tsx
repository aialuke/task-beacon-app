import { Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

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
import { useTaskSubmission } from '@/features/tasks/hooks/useTaskSubmission';
import { useTaskNavigation } from '@/lib/navigation';
import type { TaskActionsProps } from '@/types';

function TaskActions({ task, onView, isExpanded = false }: TaskActionsProps) {
  const { goToCreateFollowUpTask } = useTaskNavigation();
  const { updateTask, deleteTask, isSubmitting } = useTaskSubmission();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleToggleComplete = async () => {
    const newStatus = task.status === 'complete' ? 'pending' : 'complete';
    await updateTask(task.id, { id: task.id, status: newStatus });
  };

  const handleDelete = async () => {
    const result = await deleteTask(task.id);
    if (result.success) {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCreateFollowUp = useCallback(() => {
    goToCreateFollowUpTask(task.id);
  }, [goToCreateFollowUpTask, task.id]);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={task.status === 'complete' ? 'outline' : 'default'}
        size="sm"
        onClick={handleToggleComplete}
        disabled={isSubmitting}
        className="rounded-full"
      >
        {isSubmitting
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
              className="size-8 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:bg-muted active:bg-muted"
              disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default TaskActions;
