import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar1, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import CountdownTimer from '@/components/CountdownTimer';
import { getTaskStatus } from '@/lib/uiUtils';
import TaskActions from '@/features/tasks/components/TaskActions';
import { Skeleton } from '@/components/ui/skeleton';
import { useTaskDetails } from '@/features/tasks/hooks/useTaskDetails';

const TaskDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { task, loading, error, isPinned, setIsPinned } = useTaskDetails(id);

  if (loading) {
    return (
      <div className="container space-y-6 py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        <div className="animate-pulse space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="container py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error || 'Task not found'}
        </div>
      </div>
    );
  }

  const status = getTaskStatus(task);

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft size={16} className="mr-2" /> Back
      </Button>

      <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <CountdownTimer dueDate={task.due_date} status={status} />
          </div>
          <div>
            <h1 className="mb-2 text-2xl font-bold">{task.title}</h1>
            {task.description && (
              <p className="mb-4 text-gray-600">{task.description}</p>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="mb-3 flex items-center gap-3">
            <Calendar1 size={18} className="text-gray-500" />
            <span>
              {task.due_date ? formatDate(task.due_date) : 'No due date'}
            </span>
          </div>

          {task.url_link && (
            <div className="mb-3 flex items-center gap-2">
              <ExternalLink size={18} className="text-primary" />
              <a
                href={task.url_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {task.url_link}
              </a>
            </div>
          )}
        </div>

        {task.photo_url && (
          <div className="border-t pt-4">
            <h3 className="mb-3 text-lg font-medium">Attachment</h3>
            <img
              src={task.photo_url}
              alt="Task attachment"
              className="max-h-60 rounded-lg bg-gray-50 object-contain"
            />
          </div>
        )}

        {task.parent_task && (
          <div className="border-t pt-4">
            <h3 className="mb-3 text-lg font-medium">Follows Up On</h3>
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="font-medium">{task.parent_task.title}</h4>
              {task.parent_task.description && (
                <p className="mt-2 text-gray-600">
                  {task.parent_task.description}
                </p>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => navigate(`/tasks/${task.parent_task_id}`)}
              >
                <ExternalLink size={14} className="mr-2" />
                View Original Task
              </Button>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <TaskActions task={{ ...task, pinned: isPinned }} detailView />
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
