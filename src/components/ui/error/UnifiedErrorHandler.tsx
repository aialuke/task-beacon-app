
/**
 * Simplified Error Handler Component - Step 2.4.6.2c
 * 
 * Simplified from over-engineered unified system to basic error patterns.
 * Uses standard React patterns instead of complex abstractions.
 */

import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface UnifiedErrorHandlerProps {
  error?: Error | string | null;
  fallback?: React.ReactNode;
  onRetry?: () => void;
  variant?: 'card' | 'inline' | 'page';
  title?: string;
  className?: string;
}

/**
 * Simplified error display component using standard React patterns
 */
const UnifiedErrorHandler = memo(function UnifiedErrorHandler({
  error,
  fallback,
  onRetry,
  variant = 'card',
  title = 'Something went wrong',
  className,
}: UnifiedErrorHandlerProps) {
  if (!error) return null;

  const errorMessage = error instanceof Error ? error.message : String(error);

  // If a custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  const baseClasses = "flex flex-col items-center justify-center space-y-3";
  
  const variantClasses = {
    card: "p-6 rounded-xl border border-destructive/20 bg-destructive/5",
    inline: "p-4 rounded-lg border border-destructive/20 bg-destructive/5",
    page: "min-h-[400px] p-8",
  };

  const iconSize = variant === 'page' ? "w-16 h-16" : "w-12 h-12";

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      <div className={cn("rounded-full bg-destructive/10 flex items-center justify-center", iconSize)}>
        <svg 
          className={cn("text-destructive", variant === 'page' ? "w-8 h-8" : "w-6 h-6")} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
          />
        </svg>
      </div>
      
      <div className="text-center space-y-2">
        <h3 className={cn("font-semibold text-destructive", variant === 'page' ? "text-lg" : "text-sm")}>
          {title}
        </h3>
        <p className={cn("text-muted-foreground", variant === 'page' ? "text-base" : "text-sm")}>
          {errorMessage}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            "px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors",
            variant === 'page' ? "px-6 py-3" : "px-4 py-2"
          )}
        >
          Try Again
        </button>
      )}
    </div>
  );
});

export default UnifiedErrorHandler;
