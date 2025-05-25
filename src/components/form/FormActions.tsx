
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
    <div className="flex justify-end space-x-4 pt-6 border-t border-border/30">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          size="default"
          className="px-6 py-2 bg-background/70 text-foreground border-border/60 hover:bg-accent/80 hover:text-accent-foreground rounded-full transition-all duration-200 hover:shadow-md hover:scale-105 disabled:hover:scale-100"
        >
          {cancelLabel}
        </Button>
      )}
      <Button 
        type="submit" 
        disabled={isSubmitting}
        size="default"
        variant="default"
        className="px-8 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full transition-all duration-200 hover:shadow-md hover:scale-105 disabled:hover:scale-100 font-medium"
      >
        {isSubmitting ? "Creating..." : submitLabel}
      </Button>
    </div>
  );
}
