
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
    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          size="default"
          className="px-6 py-2 bg-background/70 text-foreground border-border/60 hover:bg-accent/80 hover:text-accent-foreground rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:hover:scale-100 font-medium order-2 sm:order-1"
        >
          {cancelLabel}
        </Button>
      )}
      <Button 
        type="submit" 
        disabled={isSubmitting}
        size="default"
        variant="default"
        className="px-8 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100 font-semibold order-1 sm:order-2 shadow-lg"
      >
        {isSubmitting ? "Creating..." : submitLabel}
      </Button>
    </div>
  );
}
