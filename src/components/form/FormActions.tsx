
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
    <div className="flex flex-col sm:flex-row justify-end gap-2">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          size="sm"
          className="order-2 sm:order-1 h-8 text-xs font-medium"
        >
          {cancelLabel}
        </Button>
      )}
      <Button 
        type="submit" 
        disabled={isSubmitting}
        size="sm"
        variant="brand"
        className="order-1 sm:order-2 h-8 text-xs font-semibold"
      >
        {isSubmitting ? "Creating..." : submitLabel}
      </Button>
    </div>
  );
}
