import { cn } from '@/lib/utils';

interface AnimatedCharacterCountProps {
  current: number;
  max: number;
  className?: string;
}

export function AnimatedCharacterCount({
  current,
  max,
  className,
}: AnimatedCharacterCountProps) {
  const percentage = (current / max) * 100;
  const isNearLimit = percentage >= 80;
  const isOverLimit = percentage >= 95;

  return (
    <div
      className={cn('flex justify-end transition-all duration-300', className)}
    >
      <span
        className={cn(
          'text-xs font-medium transition-all duration-300',
          isOverLimit
            ? 'animate-pulse text-destructive'
            : isNearLimit
              ? 'text-warning animate-pulse'
              : 'text-muted-foreground',
          isNearLimit && 'scale-105'
        )}
      >
        {current}/{max}
      </span>
    </div>
  );
}

export default AnimatedCharacterCount;
