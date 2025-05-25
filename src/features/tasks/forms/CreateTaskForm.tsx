
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
    <div className="w-full bg-card/50 backdrop-blur-sm text-card-foreground p-8 rounded-2xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <label htmlFor="title" className="block text-sm font-semibold text-foreground tracking-wide">
            Task Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title for your task"
            maxLength={22}
            required
            className="bg-background/70 text-foreground border-border/60 placeholder:text-muted-foreground/70 rounded-xl h-12 px-4 transition-all duration-200 focus:shadow-lg focus:bg-background"
          />
          <div className="flex justify-end">
            <span className={`text-xs font-medium tracking-wide transition-colors duration-200 ${title.length > 22 ? "text-destructive" : "text-muted-foreground/80"}`}>
              {title.length}/22
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          <label htmlFor="description" className="block text-sm font-semibold text-foreground tracking-wide">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your task in detail..."
            rows={4}
            className="bg-background/70 text-foreground border-border/60 placeholder:text-muted-foreground/70 rounded-xl px-4 py-3 transition-all duration-200 focus:shadow-lg focus:bg-background resize-none"
          />
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground tracking-wide">
            Due Date
          </label>
          <DatePickerField 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        
        <div className="space-y-3">
          <label htmlFor="url" className="block text-sm font-semibold text-foreground tracking-wide">
            Reference URL
          </label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="bg-background/70 text-foreground border-border/60 placeholder:text-muted-foreground/70 rounded-xl h-12 px-4 transition-all duration-200 focus:shadow-lg focus:bg-background"
          />
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground tracking-wide">
            Attachment
          </label>
          <PhotoUploadField
            onChange={handlePhotoChange}
            preview={photoPreview}
          />
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground tracking-wide">
            Assign To
          </label>
          <UserSearchField
            value={assigneeId}
            onChange={setAssigneeId}
            disabled={loading}
          />
        </div>
        
        <div className="pt-4">
          <FormActions
            onCancel={onClose}
            isSubmitting={loading}
          />
        </div>
      </form>
    </div>
  );
}
