import { useCallback, memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Task } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useTaskMutations } from '@/features/tasks/hooks/useTaskMutations';
import { toast } from '@/lib/toast';
import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface TaskActionsProps {
  task: Task;
}

function TaskActions({ task }: TaskActionsProps) {
  const navigate = useNavigate();
  const { toggleTaskComplete, deleteTaskById } = useTaskMutations();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCreateFollowUp = useCallback(() => {
    navigate(`/follow-up-task/${task.id}`);
  }, [navigate, task.id]);

  const handleToggleComplete = useCallback(async () => {
    const result = await toggleTaskComplete(task);
    if (result.success) {
      toast.success(result.message);
    } else if (result.error) {
      toast.error(result.message);
    }
  }, [toggleTaskComplete, task]);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      const result = await deleteTaskById(task.id);
      if (result.success) {
        toast.success(result.message);
        setIsDeleteDialogOpen(false);
      } else if (result.error) {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTaskById, task.id]);

  return (
    <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-2">
      <Button
        variant={task.status === 'complete' ? 'outline' : 'default'}
        size="sm"
        onClick={handleToggleComplete}
      >
        {task.status === 'complete' ? 'Mark Incomplete' : 'Complete'}
      </Button>
      <Button variant="outline" size="sm" onClick={handleCreateFollowUp}>
        Follow Up
      </Button>
      
      {/* Delete button inline with other buttons */}
      <div className="ml-auto">
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/10 hover:text-white"
              disabled={isDeleting}
            >
              <Trash2 size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Task</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
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
