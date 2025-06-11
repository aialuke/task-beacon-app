import { FileText, Sparkles } from 'lucide-react';

import { QuickActionBar } from '@/components/form/QuickActionBar';
import { FloatingInput } from '@/components/ui/form/FloatingInput';
import { FloatingTextarea } from '@/components/ui/form/FloatingTextarea';
import type { ProcessingResult } from '@/lib/utils/image';

interface UnifiedTaskFormProps {
  // Form state
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  url: string;
  setUrl: (value: string) => void;
  assigneeId: string;
  setAssigneeId: (value: string) => void;

  // Form submission
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitLabel: string;

  // Photo upload
  photoPreview: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove?: () => void;
  photoLoading?: boolean;
  processingResult?: ProcessingResult | null;

  // Presentation
  headerTitle: string;
  headerSubtitle: string;
  titleLabel?: string;
  descriptionLabel?: string;

  descriptionPlaceholder?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Unified Task Form Component - Consolidated Form Interface
 *
 * Single component for all task form variations with consistent interface.
 */
export function UnifiedTaskForm({
  // Form state
  title,
  setTitle,
  description,
  setDescription,
  dueDate,
  setDueDate,
  url,
  setUrl,
  assigneeId,
  setAssigneeId,

  // Form submission
  onSubmit,
  isSubmitting,
  submitLabel,

  // Photo upload
  photoPreview,
  onPhotoChange,
  onPhotoRemove,
  photoLoading = false,
  processingResult,

  // Presentation
  headerTitle,
  headerSubtitle,
  titleLabel = 'Task Title',
  descriptionLabel = 'Description',

  descriptionPlaceholder = 'Describe your task...',
  disabled = false,
  children,
}: UnifiedTaskFormProps) {
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  return (
    <div className="w-full rounded-3xl border border-border bg-card/40 p-8 text-card-foreground shadow-2xl shadow-black/5 backdrop-blur-xl">
      {/* Header */}
      <header className="mb-4 text-center">
        <div className="relative inline-block">
          <h1 className="mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-2xl font-bold text-foreground">
            {headerTitle}
          </h1>
          <div className="absolute -bottom-1 left-1/2 h-0.5 w-16 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/50 to-primary" />
        </div>
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          {headerSubtitle}
        </p>
      </header>

      <form className="space-y-6" onSubmit={onSubmit}>
        {/* Main Title Input */}
        <FloatingInput
          id="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          label={titleLabel}
          icon={<FileText className="size-4" />}
          maxLength={22}
          required
          disabled={disabled}
        />

        {/* Description Field */}
        <FloatingTextarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder={descriptionPlaceholder}
          label={descriptionLabel}
          icon={<Sparkles className="size-4" />}
        />

        {/* Quick Action Bar */}
        <div className="w-full">
          <QuickActionBar
            dueDate={dueDate}
            onDueDateChange={handleDueDateChange}
            assigneeId={assigneeId}
            onAssigneeChange={setAssigneeId}
            onPhotoChange={onPhotoChange}
            photoPreview={photoPreview}
            onPhotoRemove={onPhotoRemove}
            photoLoading={photoLoading}
            processingResult={processingResult}
            url={url}
            onUrlChange={handleUrlChange}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            submitLabel={submitLabel}
            disabled={disabled}
          />
        </div>

        {/* Additional content */}
        {children}
      </form>
    </div>
  );
}
