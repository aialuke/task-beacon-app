
import { useCreateTask } from '@/features/tasks/hooks/useCreateTask';
import { BaseTaskFormGeneric } from '@/components/form/BaseTaskFormGeneric';

interface CreateTaskFormDecoupledProps {
  onClose?: () => void;
}

/**
 * Decoupled create task form using dependency injection
 * Separates presentation from business logic
 */
export default function CreateTaskFormDecoupled({ onClose }: CreateTaskFormDecoupledProps) {
  const taskHook = useCreateTask({ onClose });

  return (
    <BaseTaskFormGeneric
      // Form state
      title={taskHook.title}
      setTitle={taskHook.setTitle}
      description={taskHook.description}
      setDescription={taskHook.setDescription}
      dueDate={taskHook.dueDate}
      setDueDate={taskHook.setDueDate}
      url={taskHook.url}
      setUrl={taskHook.setUrl}
      assigneeId={taskHook.assigneeId}
      setAssigneeId={taskHook.setAssigneeId}
      
      // Photo upload
      photoPreview={taskHook.photoPreview}
      onPhotoChange={taskHook.handlePhotoChange}
      onPhotoRemove={taskHook.handlePhotoRemove}
      photoLoading={taskHook.photoLoading}
      processingResult={taskHook.processingResult}
      
      // Form submission
      onSubmit={taskHook.handleSubmit}
      isSubmitting={taskHook.loading}
      submitLabel="Share Task"
      
      // Presentation
      headerTitle="Create your task"
      headerSubtitle="For every minute spent organising, an hour is earnt. ✨"
      disabled={taskHook.loading}
    />
  );
}
// CodeRabbit review
// CodeRabbit review
