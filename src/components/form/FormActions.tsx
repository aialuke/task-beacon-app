import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

export function FormActions({ 
  onSubmit,
  onCancel, 
  isSubmitting = false, 
  submitLabel = "Create Task", 
  cancelLabel = "Cancel" 
}: FormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-2">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          size="sm"
          className="px-3 py-1 bg-background/70 text-foreground border-border/60 hover:bg-accent/80 hover:text-accent-foreground rounded-lg transition-all duration-200 hover:shadow-sm font-medium order-2 sm:order-1 h-8 text-xs"
        >
          {cancelLabel}
        </Button>
      )}
      <Button 
        type="submit" 
        onClick={onSubmit}
        disabled={isSubmitting}
        size="sm"
        variant="default"
        className="px-4 py-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all duration-200 hover:shadow-md font-semibold order-1 sm:order-2 h-8 text-xs"
      >
        {isSubmitting ? "Creating..." : submitLabel}
      </Button>
    </div>
  );
}