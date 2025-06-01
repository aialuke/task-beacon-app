import { useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import type { Task } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useTaskMutations } from '../hooks/useTaskMutations';
import { toast } from '@/lib/toast';

interface TaskActionsProps {
  task: Task;
  detailView?: boolean;
}

function TaskActions({ task, detailView }: TaskActionsProps) {
  const navigate = useNavigate();
  const { toggleTaskComplete } = useTaskMutations();

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
    </div>
  );
}

export default memo(TaskActions);
