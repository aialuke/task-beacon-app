
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
    <div className="bg-card text-card-foreground p-6 rounded-xl border border-border">
      <form onSubmit={handleSubmit} className="space-y-4">
        <ParentTaskReference parentTask={parentTask} />

        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-foreground">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            maxLength={22}
            required
            className="bg-background text-foreground border-border placeholder:text-muted-foreground"
          />
          <div className="flex justify-end">
            <span className={`text-xs ${title.length > 22 ? "text-destructive" : "text-muted-foreground"}`}>
              {title.length}/22
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block text-sm font-medium text-foreground">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
            rows={3}
            className="bg-background text-foreground border-border placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Due Date
          </label>
          <DatePickerField value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            URL
          </label>
          <UrlField value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Photo
          </label>
          <PhotoUploadField onChange={handlePhotoChange} preview={photoPreview} />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Assignee
          </label>
          <UserSearchField
            value={assigneeId}
            onChange={setAssigneeId}
            disabled={loading}
          />
        </div>

        <FormActions 
          onCancel={onClose} 
          isSubmitting={loading} 
          submitLabel="Create Follow-up Task" 
        />
      </form>
    </div>
  );
}
