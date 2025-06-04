import { FileText, Sparkles } from 'lucide-react';
import { FloatingInput } from '@/components/ui/form/FloatingInput';
import { FloatingTextarea } from '@/components/ui/form/FloatingTextarea';
import { QuickActionBar } from '@/components/form/QuickActionBar';
import type { ProcessingResult } from '@/lib/utils/image/types';

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

  // Simplified photo upload props
  onPhotoRemove?: () => void;
  photoLoading?: boolean;
  processingResult?: ProcessingResult | null;
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
  titleLabel = 'Task Title',
  descriptionLabel = 'Description',
  descriptionPlaceholder = 'Describe your task...',
  children,
  onPhotoRemove,
  photoLoading = false,
  processingResult,
}: BaseTaskFormProps) {
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
  };

  return (
    <div className="w-full rounded-3xl border border-border/30 bg-card/40 p-8 text-card-foreground shadow-2xl shadow-black/5 backdrop-blur-xl">
      {/* Header - Optimized classes */}
      <header className="mb-6 text-center">
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

      <form className="space-y-6">
        {/* Main Title Input */}
        <FloatingInput
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label={titleLabel}
          icon={<FileText className="h-4 w-4" />}
          maxLength={22}
          required
        />

        {/* Description Field */}
        <FloatingTextarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={descriptionPlaceholder}
          label={descriptionLabel}
          icon={<Sparkles className="h-4 w-4" />}
        />

        {/* Quick Action Bar */}
        <div className="w-full">
          <QuickActionBar
            dueDate={dueDate}
            onDueDateChange={handleDueDateChange}
            assigneeId={assigneeId}
            onAssigneeChange={setAssigneeId}
            onPhotoChange={handlePhotoChange}
            photoPreview={photoPreview}
            onPhotoRemove={onPhotoRemove}
            photoLoading={photoLoading}
            processingResult={processingResult}
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
