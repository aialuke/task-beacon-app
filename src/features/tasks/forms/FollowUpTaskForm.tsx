import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useUnifiedPhotoUpload } from '@/components/form/hooks/useUnifiedPhotoUpload';
import { UnifiedTaskForm } from '@/features/tasks/components/forms/UnifiedTaskForm';
import { useTaskForm } from '@/features/tasks/hooks/useTaskForm';
import { useTaskFormValidation } from '@/features/tasks/hooks/useTaskFormValidation';
import { TaskService } from '@/lib/api/tasks';
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
  const queryClient = useQueryClient();

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

  const validation = useTaskFormValidation();

  const { mutate: createFollowUpTask, isPending: isCreating } = useMutation({
    mutationFn: (taskData: TaskCreateData) => TaskService.crud.create(taskData),
    onSuccess: () => {
      toast.success('Follow-up task created successfully');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      photoUpload.resetPhoto();
      onClose?.();
    },
    onError: error => {
      logger.error('Follow-up task creation error', error);
      toast.error(error.message || 'Failed to create follow-up task');
    },
  });

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
      const rawTaskData = {
        title: taskForm.title.trim(),
        description:
          taskForm.description.trim() ||
          `Follow-up from task: ${parentTask.title}`,
        due_date: taskForm.dueDate,
        url: taskForm.url.trim(),
        assignee_id: taskForm.assigneeId,
        parent_task_id: parentTask.id,
        photo_url: photoUrl ?? undefined,
        url_link: taskForm.url.trim() || undefined,
      };

      const taskData = validation.prepareTaskData(rawTaskData);
      if (!taskData) {
        toast.error('Validation failed');
        return;
      }

      // Create follow-up task
      createFollowUpTask(taskData as TaskCreateData);
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
      headerTitle="Create Follow-up Task"
      headerSubtitle={`This new task will be linked to: "${parentTask.title}"`}
    />
  );
}
