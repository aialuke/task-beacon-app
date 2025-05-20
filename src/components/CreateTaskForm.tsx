
// src/components/CreateTaskForm.tsx
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTask } from "@/hooks/useCreateTask";
import { PhotoUploadField } from "@/components/form/PhotoUploadField";
import { DatePickerField } from "@/components/form/DatePickerField";
import { FormActions } from "@/components/form/FormActions";

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
    loading,
    handlePhotoChange,
    handleSubmit
  } = useCreateTask({ onClose });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
      </div>
      <div className="space-y-2">
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          rows={3}
        />
      </div>
      <DatePickerField 
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <div className="space-y-2">
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </div>
      <PhotoUploadField
        onChange={handlePhotoChange}
        preview={photoPreview}
      />
      <FormActions
        onClose={onClose}
        isSubmitting={loading}
      />
    </form>
  );
}
