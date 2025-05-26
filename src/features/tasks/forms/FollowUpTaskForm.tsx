
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
    <div className="w-full bg-card/60 backdrop-blur-md text-card-foreground p-8 rounded-3xl border border-border/40 shadow-2xl hover:shadow-3xl transition-all duration-500">
      {/* Enhanced Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Create Follow-up Task</h1>
        <p className="text-muted-foreground text-sm">Create a task that builds upon the parent task</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Parent Task Reference */}
        <div className="bg-muted/20 rounded-2xl p-4 border border-border/30">
          <ParentTaskReference parentTask={parentTask} />
        </div>

        {/* Visual Separator */}
        <div className="border-t border-border/30 my-6"></div>

        {/* Title Section with Icon */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title for your follow-up task"
              maxLength={22}
              required
              className="bg-background/80 text-foreground border-border/60 placeholder:text-muted-foreground/70 rounded-2xl h-14 pl-12 pr-4 text-base font-medium transition-all duration-300 focus:shadow-xl focus:bg-background focus:border-primary/50 hover:bg-background/90"
            />
          </div>
          <div className="flex justify-end">
            <span className={`text-xs font-semibold tracking-wider transition-colors duration-200 px-2 py-1 rounded-full ${title.length > 22 ? "text-destructive bg-destructive/10" : "text-muted-foreground/80 bg-muted/20"}`}>
              {title.length}/22
            </span>
          </div>
        </div>

        {/* Visual Separator */}
        <div className="border-t border-border/30 my-6"></div>

        {/* Description Section */}
        <div className="space-y-3">
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your follow-up task in detail..."
            rows={4}
            className="bg-background/80 text-foreground border-border/60 placeholder:text-muted-foreground/70 rounded-2xl px-4 py-4 text-base transition-all duration-300 focus:shadow-xl focus:bg-background focus:border-primary/50 resize-none hover:bg-background/90"
          />
        </div>

        {/* Visual Separator */}
        <div className="border-t border-border/30 my-6"></div>

        {/* Date and URL Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Due Date
            </label>
            <DatePickerField value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Link className="h-4 w-4" />
              Reference URL
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <Link className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="bg-background/80 text-foreground border-border/60 placeholder:text-muted-foreground/70 rounded-2xl h-14 pl-12 pr-4 transition-all duration-300 focus:shadow-xl focus:bg-background focus:border-primary/50 hover:bg-background/90"
              />
            </div>
          </div>
        </div>

        {/* Visual Separator */}
        <div className="border-t border-border/30 my-6"></div>

        {/* Photo and Assignment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ImageUp className="h-4 w-4" />
              Attach Image
            </label>
            <PhotoUploadField onChange={handlePhotoChange} preview={photoPreview} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Assign To
            </label>
            <UserSearchField
              value={assigneeId}
              onChange={setAssigneeId}
              disabled={loading}
            />
          </div>
        </div>

        {/* Enhanced Form Actions */}
        <div className="pt-8 border-t border-border/30">
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
