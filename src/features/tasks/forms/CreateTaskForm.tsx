import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { UnifiedTaskForm } from '@/features/tasks/components/forms/UnifiedTaskForm';
import { useUnifiedPhotoUpload } from '@/components/form/hooks/useUnifiedPhotoUpload';
import { logger } from '@/lib/logger';
import { TaskService } from '@/lib/api/tasks';
import type { TaskCreateData } from '@/types';
import { useTaskForm } from '@/features/tasks/hooks/useTaskForm';
import { useTaskFormValidation } from '@/features/tasks/hooks/useTaskFormValidation';

export default function CreateTaskForm({ onClose }: { onClose?: () => void }) {
  const queryClient = useQueryClient();

  // Form state management
  const taskForm = useTaskForm({ onClose });

  // Photo upload functionality
  const photoUpload = useUnifiedPhotoUpload({
    processingOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: 'auto' as const,
    },
  });

  const validation = useTaskFormValidation();

  const { mutate: createTask, isPending: isCreating } = useMutation({
    mutationFn: (taskData: TaskCreateData) => TaskService.crud.create(taskData),
    onSuccess: () => {
      toast.success('Task created successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      photoUpload.resetPhoto();
      onClose?.();
    },
    onError: (error) => {
      logger.error('Task creation error', error);
      toast.error(error.message || 'Failed to create task');
    },
  });

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
      const rawTaskData = {
        title: taskForm.title.trim(),
        description: taskForm.description.trim() || undefined,
        due_date: taskForm.dueDate,
        url: taskForm.url.trim(),
        assignee_id: taskForm.assigneeId,
        parent_task_id: undefined, // Add if needed
        photo_url: photoUrl ?? undefined,
        url_link: taskForm.url.trim() || undefined,
      };

      const taskData = validation.prepareTaskData(rawTaskData);
      if (!taskData) {
        toast.error('Validation failed');
        return;
      }

      // Create task
      createTask(taskData as TaskCreateData);
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
      isSubmitting={isCreating || photoUpload.loading}
      onPhotoChange={photoUpload.handlePhotoChange}
      onPhotoRemove={photoUpload.handlePhotoRemove}
      photoLoading={photoUpload.loading}
      processingResult={photoUpload.processingResult}
      headerTitle="Create your task"
      headerSubtitle="For every minute spent organising, an hour is earnt. ✨"
    />
  );
}
