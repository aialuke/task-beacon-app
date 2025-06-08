
import { FileText, Sparkles } from 'lucide-react';
import { FloatingInput } from '@/components/ui/form/FloatingInput';
import { FloatingTextarea } from '@/components/ui/form/FloatingTextarea';
import { QuickActionBarDecoupled } from '@/components/form/QuickActionBarDecoupled';
import type { PhotoUploadInterface, FormSubmissionInterface, FormStateInterface } from './interfaces/PhotoUploadInterface';

interface BaseTaskFormGenericProps extends FormStateInterface, PhotoUploadInterface, FormSubmissionInterface {
  headerTitle: string;
  headerSubtitle: string;
  titlePlaceholder?: string;
  titleLabel?: string;
  descriptionPlaceholder?: string;
  descriptionLabel?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * Generic task form component decoupled from specific hook implementations
 * Uses dependency injection pattern for better testability and reusability
 */
export function BaseTaskFormGeneric({
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
  
  // Photo upload
  photoPreview,
  onPhotoChange,
  onPhotoRemove,
  photoLoading = false,
  processingResult,
  
  // Form submission
  onSubmit,
  isSubmitting,
  submitLabel,
  
  // Presentation
  headerTitle,
  headerSubtitle,
  titleLabel = 'Task Title',
  descriptionLabel = 'Description',
  descriptionPlaceholder = 'Describe your task...',
  children,
  disabled = false,
}: BaseTaskFormGenericProps) {
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
          onChange={(e) => { setTitle(e.target.value); }}
          label={titleLabel}
          icon={<FileText className="h-4 w-4" />}
          maxLength={22}
          required
        />

        {/* Description Field */}
        <FloatingTextarea
          id="description"
          value={description}
          onChange={(e) => { setDescription(e.target.value); }}
          placeholder={descriptionPlaceholder}
          label={descriptionLabel}
          icon={<Sparkles className="h-4 w-4" />}
        />

        {/* Decoupled Quick Action Bar */}
        <div className="w-full">
          <QuickActionBarDecoupled
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
// CodeRabbit review
