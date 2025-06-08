
/**
 * Generic photo upload interface for form components
 * Decouples forms from specific photo upload implementations
 */
export interface PhotoUploadInterface {
  photoPreview: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoRemove?: () => void;
  photoLoading?: boolean;
  processingResult?: unknown; // Generic to avoid tight coupling to specific processing types
}

export interface FormSubmissionInterface {
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  submitLabel: string;
}

export interface FormStateInterface {
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
}
// CodeRabbit review
// CodeRabbit review
