
import { Send } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading/UnifiedLoadingStates';
import { cn } from '@/lib/utils';

interface SubmitButtonProps {
  onSubmit?: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  disabled?: boolean;
}

export const SubmitButton = memo(function SubmitButton({
  onSubmit,
  isSubmitting = false,
  submitLabel: _submitLabel = 'Share Task',
  disabled = false,
}: SubmitButtonProps) {
  if (!onSubmit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const buttonClasses = cn(
    'flex touch-manipulation items-center justify-center gap-2 transition-all duration-200',
    'focus-visible:ring-primary/30 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 active:scale-95',
    'size-[48px]',
    'aspect-square rounded-full [aspect-ratio:1/1]',
    'bg-primary text-primary-foreground border-primary hover:bg-primary/90 border shadow-md',
    disabled && 'cursor-not-allowed opacity-50 hover:scale-100'
  );

  return (
    <Button
      type="submit"
      onClick={handleSubmit}
      disabled={disabled || isSubmitting}
      size="icon"
      className={buttonClasses}
    >
      {isSubmitting ? (
        <LoadingSpinner size="sm" className="text-primary-foreground" />
      ) : (
        <Send className="size-5 flex-shrink-0 transition-all duration-200" />
      )}
    </Button>
  );
});
