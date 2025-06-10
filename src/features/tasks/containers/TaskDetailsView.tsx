/**
 * Task Details View - Phase 2 Structural Improvement
 * 
 * Presentation component that handles UI rendering for task details.
 * Follows Container-Presentation pattern with no business logic.
 */

import { ArrowLeft, Calendar1, ExternalLink } from "lucide-react";
import { lazy, Suspense } from "react";

import { Button } from "@/components/ui/button";
import { PageLoader, CardLoader, LoadingSpinner } from "@/components/ui/loading/UnifiedLoadingStates";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDate, getTooltipContent } from "@/lib/utils/shared";
import type { Task, TaskStatus } from "@/types";

// Lazy load heavy components for better performance
const CountdownTimer = lazy(
  () => import("@/features/tasks/components/CountdownTimer")
);
const TaskActions = lazy(
  () => import("@/features/tasks/components/actions/TaskActions")
);

interface TaskDetailsViewProps {
  task: Task | null | undefined;
  status: TaskStatus | null;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
  onNavigateToTask: (taskId: string) => void;
  onNavigateToParentTask: () => void;
  className?: string;
}

export function TaskDetailsView({
  task,
  status,
  isLoading,
  error,
  onBack,
  onNavigateToTask,
  onNavigateToParentTask,
  className,
}: TaskDetailsViewProps) {
  if (isLoading) {
    return (
      <PageLoader message="Loading task details..." />
    );
  }

  if (error || !task) {
    return (
      <div className={`container py-8 ${className || ''}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error || "Task not found"}
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto max-w-2xl py-8 ${className || ''}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-6"
      >
        <ArrowLeft size={16} className="mr-2" /> Back
      </Button>

      <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <Suspense
              fallback={<LoadingSpinner size="lg" />}
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
            {task.due_date ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      {formatDate(task.due_date)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {getTooltipContent(task.due_date)}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <span>No due date</span>
            )}
          </div>

          {task.url_link && (
            <div className="mb-3 flex items-center gap-2">
              <ExternalLink size={18} className="text-primary" />
              <a
                href={task.url_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center gap-1 hover:underline"
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
                onClick={onNavigateToParentTask}
              >
                <ExternalLink size={14} className="mr-2" />
                View Original Task
              </Button>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <Suspense
            fallback={<CardLoader count={1} />}
          >
            <TaskActions task={task} onView={() => onNavigateToTask(task.id)} />
          </Suspense>
        </div>
      </div>
    </div>
  );
} 