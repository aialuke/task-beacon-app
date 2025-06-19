import { toast } from 'sonner';

import { useUnifiedPhotoUpload } from '@/components/form/hooks/useUnifiedPhotoUpload';
import UnifiedErrorBoundary from '@/components/ui/UnifiedErrorBoundary';
import UnifiedTaskForm from '@/features/tasks/components/task-management/UnifiedTaskForm';
import { useTaskForm } from '@/features/tasks/hooks/useTaskForm';
import { useTaskSubmission } from '@/features/tasks/hooks/useTaskSubmission';
import { logger } from '@/lib/logger';
import type { Task, TaskCreateData } from '@/types';

interface FollowUpTaskFormProps {
  parentTask: Task;
  onClose?: () => void;
}

export default function FollowUpTaskForm({
  parentTask,
  onClose,
}: FollowUpTaskFormProps) {
  // Form state management with follow-up defaults
  const taskForm = useTaskForm({
    onClose,
    initialDescription: `Follow-up from task: ${parentTask.title}`,
  });

  // Photo upload functionality
  const photoUpload = useUnifiedPhotoUpload({
    processingOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'auto' as const,
    },
  });

  const { createTask, isSubmitting } = useTaskSubmission();

  // Integrated submit handler for follow-up tasks
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const isValidForm = taskForm.validateForm();
    if (!isValidForm) {
      return;
    }

    try {
      // Handle photo upload
      const photoUrl = await photoUpload.uploadPhoto();

      // Prepare follow-up task data
      const taskData: TaskCreateData = {
        title: taskForm.title.trim(),
        description:
          taskForm.description.trim() ||
          `Follow-up from task: ${parentTask.title}`,
        due_date: taskForm.dueDate || undefined,
        url_link: taskForm.url.trim() || undefined,
        assignee_id: taskForm.assigneeId || undefined,
        parent_task_id: parentTask.id,
        photo_url: photoUrl ?? undefined,
      };

      // Create follow-up task
      const result = await createTask(taskData);

      if (result.success) {
        photoUpload.resetPhoto();
        onClose?.();
      }
    } catch (error) {
      logger.error(
        'Follow-up task creation error',
        error instanceof Error ? error : new Error(String(error))
      );
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to create follow-up task';
      toast.error(errorMessage);
    }
  };

  return (
    <UnifiedErrorBoundary variant="section">
      <UnifiedTaskForm
        title={taskForm.title}
        setTitle={taskForm.setTitle}
        description={taskForm.description}
        setDescription={taskForm.setDescription}
        dueDate={taskForm.dueDate}
        setDueDate={taskForm.setDueDate}
        url={taskForm.url}
        setUrl={taskForm.setUrl}
        photoPreview={photoUpload.photoPreview}
        assigneeId={taskForm.assigneeId}
        setAssigneeId={taskForm.setAssigneeId}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting || photoUpload.loading}
        onPhotoChange={photoUpload.handlePhotoChange}
        onPhotoRemove={photoUpload.handlePhotoRemove}
        photoLoading={photoUpload.loading}
        processingResult={photoUpload.processingResult}
        headerTitle="Create Follow-up Task"
        headerSubtitle={`This new task will be linked to: "${parentTask.title}"`}
      />
    </UnifiedErrorBoundary>
  );
}
