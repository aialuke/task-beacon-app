
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
          className="px-4"
          style={{ borderRadius: "0.75rem" }}
        >
          {cancelLabel}
        </Button>
      )}
      <Button 
        type="submit" 
        disabled={isSubmitting}
        size="sm"
        variant="default"
        style={{ 
          backgroundColor: "hsl(221, 77%, 55%)",
          color: "white",
          borderRadius: "0.75rem"
        }}
      >
        {isSubmitting ? "Creating..." : submitLabel}
      </Button>
    </div>
  );
}
