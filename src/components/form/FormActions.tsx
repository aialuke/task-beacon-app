
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel?: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

export function FormActions({ 
  onCancel, 
  isSubmitting, 
  submitLabel = "Create Task", 
  cancelLabel = "Cancel" 
}: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-3 pt-2">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          size="sm"
          className="px-4 bg-background text-foreground border-border hover:bg-accent hover:text-accent-foreground"
        >
          {cancelLabel}
        </Button>
      )}
      <Button 
        type="submit" 
        disabled={isSubmitting}
        size="sm"
        variant="default"
        className="px-4 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isSubmitting ? "Creating..." : submitLabel}
      </Button>
    </div>
  );
}
