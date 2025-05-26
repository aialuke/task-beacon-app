
import React from "react";
import { FileText, Sparkles } from "lucide-react";
import { Task } from "@/lib/types";
import { useFollowUpTask } from "@/features/tasks/hooks/useFollowUpTask";
import { FloatingInput } from "@/components/form/FloatingInput";
import { FloatingTextarea } from "@/components/form/FloatingTextarea";
import { QuickActionBar } from "@/components/form/QuickActionBar";
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

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  return (
    <div className="w-full bg-card/40 backdrop-blur-xl text-card-foreground p-8 rounded-3xl border border-border/30 shadow-2xl shadow-black/5">
      {/* Header matching CreateTaskForm */}
      <div className="mb-8 text-center">
        <div className="relative inline-block">
          <h1 className="text-2xl font-bold text-foreground mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Create Follow-up Task
          </h1>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-primary/50 to-primary rounded-full"></div>
        </div>
        <p className="text-muted-foreground text-sm mt-3 font-medium">
          Build upon your existing work ✨
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Title Input - Always Visible */}
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
        
        {/* Description Field - Always Visible with Sparkles Icon */}
        <FloatingTextarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your follow-up task..."
          label="Description"
          icon={<Sparkles className="h-4 w-4" />}
        />
        
        {/* Quick Action Bar with Inline Submit Button */}
        <QuickActionBar
          dueDate={dueDate}
          onDueDateChange={handleDueDateChange}
          assigneeId={assigneeId}
          onAssigneeChange={setAssigneeId}
          onPhotoChange={handlePhotoChange}
          photoPreview={photoPreview}
          url={url}
          onUrlChange={handleUrlChange}
          onSubmit={handleSubmit}
          isSubmitting={loading}
          submitLabel="Create Follow-up"
          disabled={loading}
        />

        {/* Parent Task Reference moved to bottom */}
        <div className="mt-8 pt-6 border-t border-border/20">
          <ParentTaskReference parentTask={parentTask} />
        </div>
      </form>
    </div>
  );
}
