
import type { Task } from '@/types';
import { useFollowUpTask } from '@/features/tasks/hooks/useFollowUpTask';
import { BaseTaskFormGeneric } from '@/components/form/BaseTaskFormGeneric';
import { ParentTaskReference } from '@/components/form/ParentTaskReference';

interface FollowUpTaskFormDecoupledProps {
  parentTask: Task;
  onClose?: () => void;
}

/**
 * Decoupled follow-up task form using dependency injection
 * Separates presentation from business logic
 */
export default function FollowUpTaskFormDecoupled({
  parentTask,
  onClose,
}: FollowUpTaskFormDecoupledProps) {
  const taskHook = useFollowUpTask({ parentTask, onClose });

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
      submitLabel="Create Follow-up"
      
      // Presentation
      headerTitle="Create Follow-up Task"
      headerSubtitle="Alone we can do so little; together we can do so much.✨"
      titlePlaceholder="Enter follow-up task title"
      titleLabel="Follow-up Title"
      descriptionPlaceholder="Describe your follow-up task..."
      disabled={taskHook.loading}
    >
      {/* Parent Task Reference moved to bottom */}
      <div className="mt-8 border-t border-border/20 pt-6">
        <ParentTaskReference parentTask={parentTask} />
      </div>
    </BaseTaskFormGeneric>
  );
}
// CodeRabbit review
// CodeRabbit review
