import { Button } from '@/components/ui/button';

interface FormActionsProps {
  onCancel?: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

export function FormActions({
  onCancel,
  isSubmitting,
  submitLabel = 'Create Task',
  cancelLabel = 'Cancel',
}: FormActionsProps) {
  return (
    <div className="flex flex-col justify-end gap-2 sm:flex-row">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          size="sm"
          className="order-2 h-8 rounded-lg border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-foreground transition-all duration-200 hover:bg-accent/80 hover:text-accent-foreground hover:shadow-sm sm:order-1"
        >
          {cancelLabel}
        </Button>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
        size="sm"
        variant="default"
        className="order-1 h-8 rounded-lg bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-md sm:order-2"
      >
        {isSubmitting ? 'Creating...' : submitLabel}
      </Button>
    </div>
  );
}
