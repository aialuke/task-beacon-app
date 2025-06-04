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
    isPhotoModalOpen,
    openPhotoModal,
    closePhotoModal,
    handleModalPhotoSelect,
    handlePhotoRemove,
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
      headerTitle="What would you like to accomplish?"
      headerSubtitle="For every minute spent organising, an hour is earnt.✨"
      submitLabel="Share Task"
      isPhotoModalOpen={isPhotoModalOpen}
      onPhotoModalOpen={openPhotoModal}
      onPhotoModalClose={closePhotoModal}
      onModalPhotoSelect={handleModalPhotoSelect}
      onPhotoRemove={handlePhotoRemove}
    />
  );
}
