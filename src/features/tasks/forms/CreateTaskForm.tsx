import { UnifiedTaskForm } from '../components/forms/UnifiedTaskForm';
import { useCreateTask } from '../hooks/useCreateTask';

export default function CreateTaskForm({ onClose }: { onClose?: () => void }) {
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
    processingResult,
    photoLoading,
  } = useCreateTask({ onClose });

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
      headerTitle="Create your task"
      headerSubtitle="For every minute spent organising, an hour is earnt. ✨"
    />
  );
}
