
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/lib/types";
import UserSelect from "./UserSelect";
import { useFollowUpTask } from "@/hooks/useFollowUpTask";
import { FormActions } from "./form/FormActions";
import { DatePickerField } from "./form/DatePickerField";
import { PhotoUploadField } from "./form/PhotoUploadField";
import { ParentTaskReference } from "./form/ParentTaskReference";
import { UrlField } from "./form/UrlField";
import { Label } from "./ui/label";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <ParentTaskReference parentTask={parentTask} />

      <div className="space-y-2">
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
          className="text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          rows={3}
          className="text-foreground"
        />
      </div>

      <DatePickerField value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      
      <UrlField value={url} onChange={(e) => setUrl(e.target.value)} />

      <PhotoUploadField onChange={handlePhotoChange} preview={photoPreview} />

      <div className="space-y-2">
        <Label htmlFor="assignee" className="text-foreground">Assignee</Label>
        <UserSelect
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
  );
}
