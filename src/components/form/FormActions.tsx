
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
    <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          size="lg"
          className="px-8 py-3 bg-background/70 text-foreground border-border/60 hover:bg-accent/80 hover:text-accent-foreground rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:hover:scale-100 font-medium text-base order-2 sm:order-1"
        >
          {cancelLabel}
        </Button>
      )}
      <Button 
        type="submit" 
        disabled={isSubmitting}
        size="lg"
        variant="default"
        className="px-10 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:hover:scale-100 font-semibold text-base order-1 sm:order-2 shadow-lg"
      >
        {isSubmitting ? "Creating..." : submitLabel}
      </Button>
    </div>
  );
}
