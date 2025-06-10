/**
 * Task Details Container - Phase 2 Structural Improvement
 * 
 * Container component that handles business logic and data fetching for task details.
 * Follows Container-Presentation pattern to separate concerns.
 */

import { useParams, useNavigate } from "react-router-dom";

import { useTaskQuery } from "@/features/tasks/hooks/useTaskQuery";
import { getTaskStatus } from "@/features/tasks/utils/taskUiUtils";
import type { TaskStatus } from "@/types";

import { TaskDetailsView } from "./TaskDetailsView";

interface TaskDetailsContainerProps {
  className?: string;
}

export function TaskDetailsContainer({ className }: TaskDetailsContainerProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Business logic - data fetching
  const taskQuery = useTaskQuery(id || '', {
    enabled: !!id,
  });

  const { data: task, isLoading, error: queryError } = taskQuery;
  const error = queryError?.message || null;

  // Business logic - derived state
  const status: TaskStatus | null = task ? getTaskStatus(task) : null;

  // Business logic - event handlers
  const handleBack = () => {
    navigate(-1);
  };

  const handleNavigateToTask = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  const handleNavigateToParentTask = () => {
    if (task?.parent_task_id) {
      navigate(`/tasks/${task.parent_task_id}`);
    }
  };

  // Pass all data and handlers to presentation component
  return (
    <TaskDetailsView
      task={task}
      status={status}
      isLoading={isLoading}
      error={error}
      onBack={handleBack}
      onNavigateToTask={handleNavigateToTask}
      onNavigateToParentTask={handleNavigateToParentTask}
      className={className}
    />
  );
} 