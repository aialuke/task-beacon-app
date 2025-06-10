
import { LucideIcon } from 'lucide-react';
import { memo } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const ActionButton = memo(function ActionButton({
  icon: Icon,
  label,
  active = false,
  disabled = false,
  onClick,
}: ActionButtonProps) {
  const buttonClasses = cn(
    'flex touch-manipulation items-center justify-center gap-2 transition-all duration-200',
    'focus-visible:ring-primary/30 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 active:scale-95',
    'size-[48px] sm:h-[48px] sm:w-auto sm:py-2 sm:pl-3 sm:pr-4',
    'aspect-square rounded-full [aspect-ratio:1/1] sm:aspect-auto sm:[aspect-ratio:unset]',
    active
      ? 'bg-primary/20 text-primary border-primary/30 shadow-primary/10 border shadow-md'
      : 'bg-background/60 text-muted-foreground border-border/40 hover:bg-background/80 hover:text-foreground hover:border-border/60 border',
    disabled && 'cursor-not-allowed opacity-50 hover:scale-100'
  );

  return (
    <Button 
      type="button"
      variant="ghost" 
      onClick={onClick} 
      disabled={disabled} 
      className={buttonClasses}
    >
      <Icon
        className={cn(
          'size-5 flex-shrink-0 transition-all duration-200 sm:size-4',
          active && 'scale-110'
        )}
      />
      <span className="hidden whitespace-nowrap text-sm font-medium sm:inline">
        {label}
      </span>
    </Button>
  );
});
