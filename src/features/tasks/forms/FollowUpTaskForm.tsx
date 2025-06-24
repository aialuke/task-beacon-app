import { useState } from 'react';
import { toast } from 'sonner';

import { useUnifiedPhotoUpload } from '@/components/form/hooks/useUnifiedPhotoUpload';
import UnifiedErrorBoundary from '@/components/ui/UnifiedErrorBoundary';
import UnifiedTaskForm from '@/features/tasks/components/task-management/UnifiedTaskForm';
import { useTaskSubmission } from '@/features/tasks/hooks/useTaskSubmission';
import { logger } from '@/lib/logger';
import { taskFormSchema } from '@/lib/validation/schemas';
import type { Task, TaskCreateData } from '@/types';

interface FollowUpTaskFormProps {
  parentTask: Task;
  onClose?: () => void;
}

export default function FollowUpTaskForm({
  parentTask,
  onClose,
}: FollowUpTaskFormProps) {
  // Direct React state with follow-up defaults
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(
    `Follow-up from task: ${parentTask.title}`,
  );
  const [dueDate, setDueDate] = useState('');
  const [url, setUrl] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Simple validation function
  const validateForm = () => {
    const formData = {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      url: url.trim(),
      assigneeId,
    };

    const result = taskFormSchema.safeParse(formData);

    if (result.success) {
      setErrors({});
      return true;
    }

    const newErrors: Record<string, string> = {};
    result.error.issues.forEach(issue => {
      const path = issue.path.join('.');
      if (path) {
        newErrors[path] = issue.message;
      }
    });
    setErrors(newErrors);
    return false;
  };

  // Simplified submit handler for follow-up tasks
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Handle photo upload
      const photoUrl = await photoUpload.uploadPhoto();

      // Prepare follow-up task data
      const taskData: TaskCreateData = {
        title: title.trim(),
        description:
          description.trim() || `Follow-up from task: ${parentTask.title}`,
        due_date: dueDate || undefined,
        url_link: url.trim() || undefined,
        assignee_id: assigneeId || undefined,
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
        error instanceof Error ? error : new Error(String(error)),
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
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        dueDate={dueDate}
        setDueDate={setDueDate}
        url={url}
        setUrl={setUrl}
        photoPreview={photoUpload.photoPreview}
        assigneeId={assigneeId}
        setAssigneeId={setAssigneeId}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting || photoUpload.loading}
        onPhotoChange={photoUpload.handlePhotoChange}
        onPhotoRemove={photoUpload.handlePhotoRemove}
        photoLoading={photoUpload.loading}
        processingResult={photoUpload.processingResult}
        errors={errors}
        headerTitle="Create Follow-up Task"
        headerSubtitle={`This new task will be linked to: "${parentTask.title}"`}
      />
    </UnifiedErrorBoundary>
  );
}
