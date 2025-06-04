import type { Task } from '@/types';
import { useFollowUpTask } from '@/features/tasks/hooks/useFollowUpTask';
import { BaseTaskForm } from '@/components/form/BaseTaskForm';
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
  } = useFollowUpTask({ parentTask, onClose });

  return (
    <BaseTaskForm
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
      loading={loading}
      handlePhotoChange={handlePhotoChange}
      handleSubmit={handleSubmit}
      headerTitle="Create Follow-up Task"
      headerSubtitle="Alone we can do so little; together we can do so much.✨"
      submitLabel="Create Follow-up"
      titlePlaceholder="Enter follow-up task title"
      titleLabel="Follow-up Title"
      descriptionPlaceholder="Describe your follow-up task..."
      onPhotoRemove={handlePhotoRemove}
    >
      {/* Parent Task Reference moved to bottom */}
      <div className="mt-8 border-t border-border/20 pt-6">
        <ParentTaskReference parentTask={parentTask} />
      </div>
    </BaseTaskForm>
  );
}
