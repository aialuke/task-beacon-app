import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedFormActionsProps {
  onCancel?: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

export function EnhancedFormActions({
  onCancel,
  isSubmitting,
  submitLabel = 'Create Task',
  cancelLabel = 'Cancel',
}: EnhancedFormActionsProps) {
  return (
    <div className="flex flex-col justify-end gap-3 pt-6 sm:flex-row">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className={cn(
            'order-2 h-12 rounded-xl border-border/60 bg-background/60 px-6 font-medium text-foreground backdrop-blur-sm transition-all duration-300 hover:border-border/80 hover:bg-background/80 sm:order-1',
            'hover:scale-102 active:scale-98 hover:shadow-md',
            'focus:ring-2 focus:ring-ring/30 focus:ring-offset-2'
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
        className={cn(
          'order-1 h-12 rounded-xl bg-gradient-to-r from-primary to-primary/90 px-8 font-semibold text-primary-foreground shadow-lg transition-all duration-300 hover:from-primary/90 hover:to-primary/80 hover:shadow-xl sm:order-2',
          'hover:scale-102 active:scale-98 disabled:hover:scale-100',
          'focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
          isSubmitting && 'cursor-not-allowed'
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
              <span>{submitLabel}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </div>
      </Button>
    </div>
  );
}
