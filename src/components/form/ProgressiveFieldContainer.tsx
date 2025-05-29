import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ProgressiveFieldContainerProps {
  isVisible: boolean;
  children: ReactNode;
  className?: string;
}

export function ProgressiveFieldContainer({
  isVisible,
  children,
  className,
}: ProgressiveFieldContainerProps) {
  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-500 ease-in-out',
        isVisible
          ? 'max-h-96 translate-y-0 transform opacity-100'
          : 'max-h-0 -translate-y-2 transform opacity-0',
        className
      )}
    >
      <div
        className={cn(
          'transition-all duration-300',
          isVisible ? 'pt-4' : 'pt-0'
        )}
      >
        {children}
      </div>
    </div>
  );
}
