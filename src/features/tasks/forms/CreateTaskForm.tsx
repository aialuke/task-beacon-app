
import { Link, FileText } from "lucide-react";
import { useState } from "react";
import { useCreateTask } from "@/features/tasks/hooks/useCreateTask";
import { FloatingInput } from "@/components/form/FloatingInput";
import { FloatingTextarea } from "@/components/form/FloatingTextarea";
import { EnhancedDatePicker } from "@/components/form/EnhancedDatePicker";
import { EnhancedPhotoUpload } from "@/components/form/EnhancedPhotoUpload";
import { EnhancedUserSearch } from "@/components/form/EnhancedUserSearch";
import { EnhancedFormActions } from "@/components/form/EnhancedFormActions";
import { QuickActionBar } from "@/components/form/QuickActionBar";
import { ProgressiveFieldContainer } from "@/components/form/ProgressiveFieldContainer";

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

  // Toggle states for progressive disclosure
  const [activeToggles, setActiveToggles] = useState({
    dueDate: false,
    assignee: false,
    photo: false,
    url: false,
    description: false
  });

  const handleToggle = (toggle: keyof typeof activeToggles) => {
    setActiveToggles(prev => ({
      ...prev,
      [toggle]: !prev[toggle]
    }));
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
        
        {/* Quick Action Toggle Bar */}
        <QuickActionBar
          activeToggles={activeToggles}
          onToggle={handleToggle}
          disabled={loading}
        />
        
        {/* Progressive Field Reveals */}
        <div className="space-y-2">
          {/* Description Field */}
          <ProgressiveFieldContainer isVisible={activeToggles.description}>
            <FloatingTextarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your task..."
              label="Description"
            />
          </ProgressiveFieldContainer>

          {/* Date and URL Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProgressiveFieldContainer isVisible={activeToggles.dueDate}>
              <EnhancedDatePicker 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </ProgressiveFieldContainer>
            
            <ProgressiveFieldContainer isVisible={activeToggles.url}>
              <FloatingInput
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                label="Reference URL"
                icon={<Link className="h-4 w-4" />}
              />
            </ProgressiveFieldContainer>
          </div>
          
          {/* Assignment and Photo Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ProgressiveFieldContainer isVisible={activeToggles.assignee}>
              <EnhancedUserSearch
                value={assigneeId}
                onChange={setAssigneeId}
                disabled={loading}
              />
            </ProgressiveFieldContainer>
            
            <ProgressiveFieldContainer isVisible={activeToggles.photo}>
              <EnhancedPhotoUpload
                onChange={handlePhotoChange}
                preview={photoPreview}
              />
            </ProgressiveFieldContainer>
          </div>
        </div>
        
        {/* Enhanced Actions */}
        <EnhancedFormActions
          onCancel={onClose}
          isSubmitting={loading}
          submitLabel="Share Task"
        />
      </form>
    </div>
  );
}
