
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, FileText, Calendar, User, ImageUp } from "lucide-react";
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
    <div className="w-full bg-card/60 backdrop-blur-md text-card-foreground p-4 rounded-2xl border border-border/40 shadow-xl">
      {/* Compact Header */}
      <div className="mb-4 text-center">
        <h1 className="text-xl font-bold text-foreground mb-1">Create New Task</h1>
        <p className="text-muted-foreground text-xs">Fill in the details to create your task</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Title Section */}
        <div className="space-y-1">
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              maxLength={22}
              required
              className="bg-background/80 text-foreground border-border/60 placeholder:text-muted-foreground/70 rounded-xl h-9 pl-10 pr-4 text-sm font-medium transition-all duration-200 focus:bg-background focus:border-primary/50"
            />
          </div>
          <div className="flex justify-end">
            <span className={`text-xs font-medium tracking-wide transition-colors px-1 py-0.5 rounded ${title.length > 22 ? "text-destructive" : "text-muted-foreground/60"}`}>
              {title.length}/22
            </span>
          </div>
        </div>
        
        {/* Description Section */}
        <div className="space-y-1">
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your task..."
            rows={2}
            className="bg-background/80 text-foreground border-border/60 placeholder:text-muted-foreground/70 rounded-xl px-3 py-2 text-sm transition-all duration-200 focus:bg-background focus:border-primary/50 resize-none"
          />
        </div>
        
        {/* 3-Column Grid for Date, URL, Assignment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Due Date</label>
            <DatePickerField 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Reference URL</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <Link className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="bg-background/80 text-foreground border-border/60 placeholder:text-muted-foreground/70 rounded-xl h-9 pl-10 pr-3 text-sm transition-all duration-200 focus:bg-background focus:border-primary/50"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Assign To</label>
            <UserSearchField
              value={assigneeId}
              onChange={setAssigneeId}
              disabled={loading}
            />
          </div>
        </div>
        
        {/* 2-Column Bottom Section for Photo and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Attach Image</label>
            <PhotoUploadField
              onChange={handlePhotoChange}
              preview={photoPreview}
            />
          </div>
          
          <div className="flex items-end">
            <div className="w-full">
              <FormActions
                onCancel={onClose}
                isSubmitting={loading}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
