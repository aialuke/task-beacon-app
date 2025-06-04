
import { memo } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  onSubmit?: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  disabled?: boolean;
}

export const SubmitButton = memo(function SubmitButton({
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Share Task',
  disabled = false,
}: SubmitButtonProps) {
  if (!onSubmit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const buttonClasses = cn(
    'flex items-center justify-center gap-2 transition-all duration-200 touch-manipulation',
    'hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
    'w-[48px] h-[48px]',
    'rounded-full aspect-square [aspect-ratio:1/1]',
    'bg-primary text-primary-foreground border border-primary shadow-md hover:bg-primary/90',
    disabled && 'opacity-50 cursor-not-allowed hover:scale-100'
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
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
      ) : (
        <Send className="h-5 w-5 flex-shrink-0 transition-all duration-200" />
      )}
    </Button>
  );
});
