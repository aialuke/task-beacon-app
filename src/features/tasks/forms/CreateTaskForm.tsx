
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTask } from "@/features/tasks/hooks/useCreateTask";
import { PhotoUploadField } from "@/components/form/PhotoUploadField";
import { DatePickerField } from "@/components/form/DatePickerField";
import { FormActions } from "@/components/form/FormActions";
import { UserSearchField } from "@/components/form/UserSearchField";

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
    <div className="bg-card text-card-foreground p-6 rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            maxLength={22}
            required
            className="bg-background text-foreground border-border"
          />
          <div className="flex justify-end">
            <span className={`text-xs ${title.length > 22 ? "text-destructive" : "text-muted-foreground"}`}>
              {title.length}/22
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            rows={3}
            className="bg-background text-foreground border-border"
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
            className="bg-background text-foreground border-border"
          />
        </div>
        <PhotoUploadField
          onChange={handlePhotoChange}
          preview={photoPreview}
        />
        <UserSearchField
          value={assigneeId}
          onChange={setAssigneeId}
          disabled={loading}
        />
        <FormActions
          onCancel={onClose}
          isSubmitting={loading}
        />
      </form>
    </div>
  );
}
