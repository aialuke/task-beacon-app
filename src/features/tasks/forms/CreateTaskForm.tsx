
import { useCreateTask } from "@/features/tasks/hooks/useCreateTask";
import { BaseTaskForm } from "@/components/form/BaseTaskForm";

export default function CreateTaskForm({
  onClose,
}: {
  onClose?: () => void;
}) {
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
    handleSubmit
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
      headerSubtitle="Create your next task with style ✨"
      submitLabel="Share Task"
    />
  );
}
