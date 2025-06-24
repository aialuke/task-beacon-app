import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SubmitButtonProps {
  onSubmit?: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  disabled?: boolean;
}

export function SubmitButton({
  onSubmit,
  isSubmitting = false,
  disabled = false,
}: SubmitButtonProps) {
  if (!onSubmit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e);
  };

  const buttonClasses = cn(
    'flex touch-manipulation items-center justify-center gap-2 transition-all duration-200',
    'hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-95',
    'size-[48px]',
    'aspect-square rounded-full [aspect-ratio:1/1]',
    'border border-primary bg-primary text-primary-foreground shadow-md hover:bg-primary/90',
    disabled && 'cursor-not-allowed opacity-50 hover:scale-100',
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
        <div className="size-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
      ) : (
        <Send className="size-5 flex-shrink-0 transition-all duration-200" />
      )}
    </Button>
  );
}
