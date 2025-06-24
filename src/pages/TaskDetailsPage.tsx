import { ArrowLeft, Calendar1, ExternalLink } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import UnifiedErrorBoundary from '@/components/ui/UnifiedErrorBoundary';
import { useTaskQuery } from '@/features/tasks/hooks/useTaskQuery';
import { getTaskStatus } from '@/features/tasks/utils/taskUiUtils';
import { useTaskNavigation } from '@/lib/navigation';
import { formatDate } from '@/lib/utils/date';

// Lazy load heavy components for better performance
const CountdownTimer = lazy(
  () => import('@/features/tasks/components/task-interaction/CountdownTimer'),
);
const TaskActions = lazy(
  () => import('@/features/tasks/components/task-management/TaskActions'),
);

const TaskDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { goBack, goToTaskDetails } = useTaskNavigation();
  const { task } = useTaskQuery(id);

  if (!task) {
    return (
      <div className="container py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            goBack();
          }}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          Task not found
        </div>
      </div>
    );
  }

  const status = getTaskStatus(task);

  return (
    <UnifiedErrorBoundary variant="page">
      <div className="container mx-auto max-w-2xl py-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => goBack()}
          className="mb-6"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>

        <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="shrink-0">
              <Suspense
                fallback={
                  <div className="flex size-24 items-center justify-center">
                    <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                }
              >
                <CountdownTimer dueDate={task.due_date} status={status} />
              </Suspense>
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
                  className="flex items-center gap-1 text-primary transition-colors duration-200 hover:underline focus-visible:underline active:underline"
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
                  onClick={() => {
                    goToTaskDetails(task.parent_task_id);
                  }}
                >
                  <ExternalLink size={14} className="mr-2" />
                  View Original Task
                </Button>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-4">
                  <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              }
            >
              <TaskActions
                task={task}
                onView={() => {
                  goToTaskDetails(task.id);
                }}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </UnifiedErrorBoundary>
  );
};

export default TaskDetailsPage;
