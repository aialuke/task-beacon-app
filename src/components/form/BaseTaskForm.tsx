
import React from "react";
import { FileText, Sparkles } from "lucide-react";
import { FloatingInput } from "@/components/form/FloatingInput";
import { FloatingTextarea } from "@/components/form/FloatingTextarea";
import { QuickActionBar } from "@/components/form/QuickActionBar";

interface BaseTaskFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  url: string;
  setUrl: (value: string) => void;
  photoPreview: string | null;
  assigneeId: string;
  setAssigneeId: (value: string) => void;
  loading: boolean;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  headerTitle: string;
  headerSubtitle: string;
  submitLabel: string;
  titlePlaceholder?: string;
  titleLabel?: string;
  descriptionPlaceholder?: string;
  descriptionLabel?: string;
  children?: React.ReactNode;
}

export function BaseTaskForm({
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
  handleSubmit,
  headerTitle,
  headerSubtitle,
  submitLabel,
  titlePlaceholder = "Enter task title",
  titleLabel = "Task Title",
  descriptionPlaceholder = "Describe your task...",
  descriptionLabel = "Description",
  children
}: BaseTaskFormProps) {
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  return (
    <div className="w-full bg-card/40 backdrop-blur-xl text-card-foreground p-8 rounded-3xl border border-border/30 shadow-2xl shadow-black/5 bg-gradient-to-br from-card via-card to-muted/10 transition-all duration-300 hover:shadow-3xl hover:shadow-primary/5">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="relative inline-block">
          <h1 className="text-2xl font-bold text-foreground mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            {headerTitle}
          </h1>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-primary/50 to-primary rounded-full transition-all duration-500 hover:w-20 hover:from-primary hover:to-primary/80"></div>
        </div>
        <p className="text-muted-foreground text-sm mt-3 font-medium">
          {headerSubtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Title Input */}
        <div className="relative group">
          <FloatingInput
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={titlePlaceholder}
            label={titleLabel}
            icon={<FileText className="h-4 w-4 transition-colors duration-200 group-focus-within:text-primary" />}
            maxLength={22}
            required
          />
        </div>
        
        {/* Description Field */}
        <div className="relative group">
          <FloatingTextarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={descriptionPlaceholder}
            label={descriptionLabel}
            icon={<Sparkles className="h-4 w-4 transition-colors duration-200 group-focus-within:text-primary" />}
          />
        </div>
        
        {/* Quick Action Bar */}
        <div className="transform transition-all duration-300 hover:scale-[1.02]">
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
            submitLabel={submitLabel}
            disabled={loading}
          />
        </div>

        {/* Additional content */}
        {children}
      </form>
    </div>
  );
}
