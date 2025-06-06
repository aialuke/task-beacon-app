
import { useRef, useEffect, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface FloatingInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      id,
      label,
      type = 'text',
      value,
      onChange,
      error,
      required = false,
      autoComplete,
      disabled = false,
      className,
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Label is visible only when the input has no value (regardless of focus state)
    const showLabel = value.length === 0;

    useEffect(() => {
      if (error && inputRef.current) {
        inputRef.current.focus();
      }
    }, [error]);

    return (
      <div className="group relative">
        {showLabel && (
          <label
            htmlFor={id}
            className={cn(
              'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground transition-opacity duration-200', // Added transition for smooth disappearance
              error && 'text-destructive'
            )}
          >
            {label}
            {required && <span className="ml-1 text-destructive">*</span>}
          </label>
        )}
        <input
          ref={ref || inputRef} // Use forwarded ref if provided, otherwise use local ref
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          className={cn(
            'peer h-10 w-full rounded-xl border bg-input/20 px-3 py-2 outline-none transition-all duration-300', // Removed explicit border-border to use default
            'focus:border-primary focus:bg-input/30 focus:ring-2 focus:ring-primary/20',
            'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2', // Added focus-visible styles
            error
              ? 'border-destructive focus:border-destructive focus:ring-destructive/20 focus-visible:ring-destructive focus-visible:ring-offset-2'
              : 'hover:border-primary/50',
            disabled && 'cursor-not-allowed opacity-50',
            className
          )}
        />

        {error && (
          <p className="mt-1 animate-fade-in text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

export { FloatingInput };
