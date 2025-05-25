
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/lib/types";
import { useFollowUpTask } from "@/features/tasks/hooks/useFollowUpTask";
import { FormActions } from "@/components/form/FormActions";
import { DatePickerField } from "@/components/form/DatePickerField";
import { PhotoUploadField } from "@/components/form/PhotoUploadField";
import { ParentTaskReference } from "@/components/form/ParentTaskReference";
import { UrlField } from "@/components/form/UrlField";
import { UserSearchField } from "@/components/form/UserSearchField";

interface FollowUpTaskFormProps {
  parentTask: Task;
  onClose?: () => void;
}

export default function FollowUpTaskForm({ parentTask, onClose }: FollowUpTaskFormProps) {
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
  } = useFollowUpTask({ parentTask, onClose });

  return (
    <div className="w-full bg-card/50 backdrop-blur-sm text-card-foreground p-8 rounded-2xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="pb-2">
          <ParentTaskReference parentTask={parentTask} />
        </div>

        <div className="space-y-3">
          <label htmlFor="title" className="block text-sm font-semibold text-foreground tracking-wide">
            Follow-up Task Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title for your follow-up task"
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
            placeholder="Describe your follow-up task in detail..."
            rows={4}
            className="bg-background/70 text-foreground border-border/60 placeholder:text-muted-foreground/70 rounded-xl px-4 py-3 transition-all duration-200 focus:shadow-lg focus:bg-background resize-none"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground tracking-wide">
            Due Date
          </label>
          <DatePickerField value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground tracking-wide">
            Reference URL
          </label>
          <UrlField value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-foreground tracking-wide">
            Attachment
          </label>
          <PhotoUploadField onChange={handlePhotoChange} preview={photoPreview} />
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
            submitLabel="Create Follow-up Task" 
          />
        </div>
      </form>
    </div>
  );
}
