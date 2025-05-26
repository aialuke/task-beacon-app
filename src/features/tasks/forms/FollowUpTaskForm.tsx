
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, FileText, Calendar, User, ImageUp } from "lucide-react";
import { Task } from "@/lib/types";
import { useFollowUpTask } from "@/features/tasks/hooks/useFollowUpTask";
import { FormActions } from "@/components/form/FormActions";
import { DatePickerField } from "@/components/form/DatePickerField";
import { PhotoUploadField } from "@/components/form/PhotoUploadField";
import { ParentTaskReference } from "@/components/form/ParentTaskReference";
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
    <div className="w-full bg-card/60 backdrop-blur-md text-card-foreground p-4 rounded-2xl border border-border/40 shadow-xl">
      {/* Compact Header */}
      <div className="mb-3 text-center">
        <h1 className="text-lg font-bold text-foreground mb-1">Create Follow-up Task</h1>
        <p className="text-muted-foreground text-xs">Create a task that builds upon the parent task</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Parent Task Reference */}
        <div className="bg-muted/20 rounded-xl p-2 border border-border/20">
          <ParentTaskReference parentTask={parentTask} />
        </div>

        {/* Title + Description Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter follow-up task title"
                maxLength={22}
                required
                className="bg-background/80 text-foreground border-border/60 placeholder:text-muted-foreground/70 rounded-xl h-8 pl-10 pr-16 text-sm font-medium transition-all duration-200 focus:bg-background focus:border-primary/50"
              />
              <span className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium ${title.length > 22 ? "text-destructive" : "text-muted-foreground/60"}`}>
                {title.length}/22
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your follow-up task..."
              rows={1}
              className="bg-background/80 text-foreground border-border/60 placeholder:text-muted-foreground/70 rounded-xl px-3 py-2 text-sm transition-all duration-200 focus:bg-background focus:border-primary/50 resize-none min-h-8"
            />
          </div>
        </div>

        {/* Date + URL Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="space-y-1">
            <DatePickerField value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          
          <div className="space-y-1">
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
                className="bg-background/80 text-foreground border-border/60 placeholder:text-muted-foreground/70 rounded-xl h-8 pl-10 pr-3 text-sm transition-all duration-200 focus:bg-background focus:border-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Assignment + Photo Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="space-y-1">
            <UserSearchField
              value={assigneeId}
              onChange={setAssigneeId}
              disabled={loading}
            />
          </div>
          
          <div className="space-y-1">
            <PhotoUploadField onChange={handlePhotoChange} preview={photoPreview} />
          </div>
        </div>

        {/* Actions Row */}
        <div className="pt-2">
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
