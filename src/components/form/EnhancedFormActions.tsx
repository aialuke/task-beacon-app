
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedFormActionsProps {
  onCancel?: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

export function EnhancedFormActions({ 
  onCancel, 
  isSubmitting, 
  submitLabel = "Create Task", 
  cancelLabel = "Cancel" 
}: EnhancedFormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className={cn(
            "h-12 px-6 rounded-xl transition-all duration-300 font-medium order-2 sm:order-1 group",
            "hover:shadow-md hover:scale-102 active:scale-98",
            "focus:ring-2 focus:ring-ring/30 focus:ring-offset-2"
          )}
        >
          <span className="transition-transform duration-200 group-hover:scale-105">
            {cancelLabel}
          </span>
        </Button>
      )}
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        variant="brand"
        className={cn(
          "h-12 px-8 rounded-xl transition-all duration-300 font-semibold order-1 sm:order-2 shadow-lg hover:shadow-xl group",
          "hover:scale-102 active:scale-98 disabled:hover:scale-100",
          "focus:ring-2 focus:ring-primary/30 focus:ring-offset-2",
          "hover:shadow-primary/20",
          isSubmitting && "cursor-not-allowed"
        )}
      >
        <div className="flex items-center gap-3">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <span className="transition-transform duration-200 group-hover:scale-105">{submitLabel}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </div>
      </Button>
    </div>
  );
}
