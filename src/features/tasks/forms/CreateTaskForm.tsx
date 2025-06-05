import { useCreateTask } from '@/features/tasks/hooks/useCreateTask';
import { BaseTaskForm } from '@/components/form/BaseTaskForm';

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
      headerTitle="Create your task"
      headerSubtitle="For every minute spent organising, an hour is earnt.✨"
      submitLabel="Share Task"
      onPhotoRemove={handlePhotoRemove}
      photoLoading={photoLoading}
      processingResult={processingResult}
    />
  );
}
