
import type { Task } from '@/types';
import { useFollowUpTask } from '@/features/tasks/hooks/useFollowUpTask';
import { UnifiedTaskForm } from '@/components/form/UnifiedTaskForm';
import { ParentTaskReference } from '@/components/form/ParentTaskReference';

interface FollowUpTaskFormProps {
  parentTask: Task;
  onClose?: () => void;
}

export default function FollowUpTaskForm({
  parentTask,
  onClose,
}: FollowUpTaskFormProps) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    url,
    setUrl,
    photoPreview,
    assigneeId,
    setAssigneeId,
    loading,
    handlePhotoChange,
    handleSubmit,
    handlePhotoRemove,
    photoLoading,
    processingResult,
  } = useFollowUpTask({ parentTask, onClose });

  return (
    <UnifiedTaskForm
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      dueDate={dueDate}
      setDueDate={setDueDate}
      url={url}
      setUrl={setUrl}
      photoPreview={photoPreview}
      assigneeId={assigneeId}
      setAssigneeId={setAssigneeId}
      onSubmit={handleSubmit}
      isSubmitting={loading}
      onPhotoChange={handlePhotoChange}
      onPhotoRemove={handlePhotoRemove}
      photoLoading={photoLoading}
      processingResult={processingResult}
      headerTitle="Create Follow-up Task"
      headerSubtitle="Alone we can do so little; together we can do so much.✨"
      submitLabel="Create Follow-up"
      titlePlaceholder="Enter follow-up task title"
      titleLabel="Follow-up Title"
      descriptionPlaceholder="Describe your follow-up task..."
    >
      {/* Parent Task Reference */}
      <div className="mt-8 border-t border-border/20 pt-6">
        <ParentTaskReference parentTask={parentTask} />
      </div>
    </UnifiedTaskForm>
  );
}
