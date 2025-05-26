
import { FileText, Sparkles } from "lucide-react";
import { useCreateTask } from "@/features/tasks/hooks/useCreateTask";
import { FloatingInput } from "@/components/form/FloatingInput";
import { FloatingTextarea } from "@/components/form/FloatingTextarea";
import { QuickActionBar } from "@/components/form/QuickActionBar";

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

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  return (
    <div className="w-full bg-card/40 backdrop-blur-xl text-card-foreground p-8 rounded-3xl border border-border/30 shadow-2xl shadow-black/5">
      {/* Social Media Style Header */}
      <div className="mb-8 text-center">
        <div className="relative inline-block">
          <h1 className="text-2xl font-bold text-foreground mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            What would you like to accomplish?
          </h1>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-primary/50 to-primary rounded-full"></div>
        </div>
        <p className="text-muted-foreground text-sm mt-3 font-medium">
          Create your next task with style ✨
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Title Input - Always Visible */}
        <FloatingInput
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          label="Task Title"
          icon={<FileText className="h-4 w-4" />}
          maxLength={22}
          required
        />
        
        {/* Description Field - Always Visible with Sparkles Icon */}
        <FloatingTextarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your task..."
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
          submitLabel="Share Task"
          disabled={loading}
        />
      </form>
    </div>
  );
}
