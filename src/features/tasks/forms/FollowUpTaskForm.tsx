
import React from "react";
import { Link, FileText } from "lucide-react";
import { Task } from "@/lib/types";
import { useFollowUpTask } from "@/features/tasks/hooks/useFollowUpTask";
import { FloatingInput } from "@/components/form/FloatingInput";
import { FloatingTextarea } from "@/components/form/FloatingTextarea";
import { EnhancedDatePicker } from "@/components/form/EnhancedDatePicker";
import { EnhancedPhotoUpload } from "@/components/form/EnhancedPhotoUpload";
import { EnhancedUserSearch } from "@/components/form/EnhancedUserSearch";
import { EnhancedFormActions } from "@/components/form/EnhancedFormActions";
import { ParentTaskReference } from "@/components/form/ParentTaskReference";

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
    <div className="w-full bg-card/40 backdrop-blur-xl text-card-foreground p-8 rounded-3xl border border-border/30 shadow-2xl shadow-black/5">
      {/* Elegant Header */}
      <div className="mb-8 text-center">
        <div className="relative inline-block">
          <h1 className="text-2xl font-bold text-foreground mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Create Follow-up Task
          </h1>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-primary/50 to-primary rounded-full"></div>
        </div>
        <p className="text-muted-foreground text-sm mt-3 font-medium">
          Build upon your existing work with seamless continuity
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Parent Task Reference with enhanced styling */}
        <div className="bg-muted/10 backdrop-blur-sm rounded-2xl p-4 border border-border/20 mb-6">
          <ParentTaskReference parentTask={parentTask} />
        </div>

        {/* Title + Description Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FloatingInput
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter follow-up task title"
            label="Follow-up Title"
            icon={<FileText className="h-4 w-4" />}
            maxLength={22}
            required
          />

          <FloatingTextarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your follow-up task..."
            label="Description"
          />
        </div>

        {/* Date + URL Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnhancedDatePicker 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)} 
          />
          
          <FloatingInput
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            label="Reference URL"
            icon={<Link className="h-4 w-4" />}
          />
        </div>

        {/* Assignment + Photo Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EnhancedUserSearch
            value={assigneeId}
            onChange={setAssigneeId}
            disabled={loading}
          />
          
          <EnhancedPhotoUpload 
            onChange={handlePhotoChange} 
            preview={photoPreview} 
          />
        </div>

        {/* Enhanced Actions */}
        <EnhancedFormActions 
          onCancel={onClose} 
          isSubmitting={loading} 
          submitLabel="Create Follow-up Task" 
        />
      </form>
    </div>
  );
}
