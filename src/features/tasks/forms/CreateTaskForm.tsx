
import { toast } from 'sonner';

import { useUnifiedPhotoUpload } from '@/components/form/hooks/useUnifiedPhotoUpload';
import UnifiedErrorBoundary from '@/components/ui/UnifiedErrorBoundary';
import UnifiedTaskForm from '@/features/tasks/components/task-management/UnifiedTaskForm';
import { useTaskForm } from '@/features/tasks/hooks/useTaskForm';
import { useTaskSubmission } from '@/features/tasks/hooks/useTaskSubmission';
import { logger } from '@/lib/logger';
import type { TaskCreateData } from '@/types';

export default function CreateTaskForm({ onClose }: { onClose?: (() => void) | undefined }) {
  // Form state management with proper optional handling
  const taskForm = useTaskForm({ 
    ...(onClose && { onClose })
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

  // Integrated submit handler
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

      // Prepare task data
      const taskData: TaskCreateData = {
        title: taskForm.title.trim(),
        description: taskForm.description.trim() || undefined,
        due_date: taskForm.dueDate || undefined,
        url_link: taskForm.url.trim() || undefined,
        assignee_id: taskForm.assigneeId || undefined,
        photo_url: photoUrl ?? undefined,
      };

      // Create task
      const result = await createTask(taskData);

      if (result.success) {
        photoUpload.resetPhoto();
        onClose?.();
      }
    } catch (error) {
      logger.error(
        'Task creation error',
        error instanceof Error ? error : new Error(String(error))
      );
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create task';
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
        {...(photoUpload.handlePhotoRemove && { onPhotoRemove: photoUpload.handlePhotoRemove })}
        photoLoading={photoUpload.loading}
        processingResult={photoUpload.processingResult}
        headerTitle="Create your task"
        headerSubtitle="For every minute spent organising, an hour is earnt. ✨"
      />
    </UnifiedErrorBoundary>
  );
}
