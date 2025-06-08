
import { memo } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
    'flex items-center justify-center gap-2 transition-all duration-200 touch-manipulation',
    'hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
    'w-[48px] h-[48px] sm:w-auto sm:h-[48px] sm:pl-3 sm:pr-4 sm:py-2',
    'rounded-full aspect-square [aspect-ratio:1/1] sm:aspect-auto sm:[aspect-ratio:unset]',
    active
      ? 'bg-primary/20 text-primary border border-primary/30 shadow-md shadow-primary/10'
      : 'bg-background/60 text-muted-foreground border border-border/40 hover:bg-background/80 hover:text-foreground hover:border-border/60',
    disabled && 'opacity-50 cursor-not-allowed hover:scale-100'
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
          'h-5 w-5 flex-shrink-0 transition-all duration-200 sm:h-4 sm:w-4',
          active && 'scale-110'
        )}
      />
      <span className="hidden whitespace-nowrap text-sm font-medium sm:inline">
        {label}
      </span>
    </Button>
  );
});
// CodeRabbit review
// CodeRabbit review
