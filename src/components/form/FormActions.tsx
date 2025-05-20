
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
    <div className="flex justify-end space-x-2 pt-2">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting} className="btn-primary">
        {isSubmitting ? "Creating..." : submitLabel}
      </Button>
    </div>
  );
}
