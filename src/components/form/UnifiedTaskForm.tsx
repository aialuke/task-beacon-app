
import { FileText, Sparkles } from 'lucide-react';
import { useState, useCallback } from 'react';

import { QuickActionBar } from '@/components/form/QuickActionBar';
import { FloatingInput } from '@/components/ui/form/FloatingInput';
import { FloatingTextarea } from '@/components/ui/form/FloatingTextarea';
import { isDatePast } from '@/lib/utils/date';
import type { ProcessingResult } from '@/lib/utils/image';
import { validateTaskCreation, isValidUrl } from '@/lib/validation/validators';

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
  titlePlaceholder?: string;
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
  titlePlaceholder: _titlePlaceholder,
  descriptionPlaceholder = 'Describe your task...',
  disabled = false,
  children,
}: UnifiedTaskFormProps) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const formData = {
      title,
      description,
      dueDate: dueDate || undefined,
      url: url || undefined,
      assigneeId: assigneeId || undefined,
    };

    // Use enhanced task creation validation
    const result = validateTaskCreation(formData);
    const errors: Record<string, string> = {};

    if (!result.success) {
      result.error.errors.forEach(error => {
        const field = error.path.join('.');
        if (field) {
          errors[field] = error.message;
        }
      });
    }

    // Additional URL validation using isValidUrl
    if (url && !isValidUrl(url)) {
      errors.url = 'Please enter a valid URL';
    }

    // Additional date validation using isDatePast
    if (dueDate && isDatePast(dueDate)) {
      errors.dueDate = 'Due date must be in the future';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [title, description, dueDate, url, assigneeId]);

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    // Clear URL validation error when user starts typing
    if (validationErrors.url) {
      setValidationErrors(prev => ({ ...prev, url: '' }));
    }
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
    // Clear date validation error when user changes date
    if (validationErrors.dueDate) {
      setValidationErrors(prev => ({ ...prev, dueDate: '' }));
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    // Clear title validation error when user starts typing
    if (validationErrors.title) {
      setValidationErrors(prev => ({ ...prev, title: '' }));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    // Clear description validation error when user starts typing
    if (validationErrors.description) {
      setValidationErrors(prev => ({ ...prev, description: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  return (
    <div className="border-border bg-card/40 text-card-foreground w-full rounded-3xl border p-8 shadow-2xl shadow-black/5 backdrop-blur-xl">
      {/* Header */}
      <header className="mb-4 text-center">
        <div className="relative inline-block">
          <h1 className="from-foreground to-foreground/80 text-foreground mb-2 bg-gradient-to-r bg-clip-text text-2xl font-bold">
            {headerTitle}
          </h1>
          <div className="from-primary/50 to-primary absolute -bottom-1 left-1/2 h-0.5 w-16 -translate-x-1/2 rounded-full bg-gradient-to-r" />
        </div>
        <p className="text-muted-foreground mt-3 text-sm font-medium">
          {headerSubtitle}
        </p>
      </header>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Main Title Input */}
        <div>
          <FloatingInput
            id="title"
            value={title}
            onChange={handleTitleChange}
            label={titleLabel}
            icon={<FileText className="size-4" />}
            maxLength={22}
            required
            disabled={disabled}
          />
          {validationErrors.title && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.title}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <FloatingTextarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder={descriptionPlaceholder}
            label={descriptionLabel}
            icon={<Sparkles className="size-4" />}
          />
          {validationErrors.description && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.description}</p>
          )}
        </div>

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
