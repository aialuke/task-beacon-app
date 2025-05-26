
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
          className="px-4 py-1.5 bg-background/70 text-foreground border-border/60 hover:bg-accent/80 hover:text-accent-foreground rounded-xl transition-all duration-200 hover:shadow-md font-medium order-2 sm:order-1"
        >
          {cancelLabel}
        </Button>
      )}
      <Button 
        type="submit" 
        disabled={isSubmitting}
        size="sm"
        variant="default"
        className="px-6 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all duration-200 hover:shadow-lg font-semibold order-1 sm:order-2"
      >
        {isSubmitting ? "Creating..." : submitLabel}
      </Button>
    </div>
  );
}
