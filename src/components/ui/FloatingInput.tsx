import { useState, useRef, useEffect, forwardRef, type ChangeEvent } from 'react';

import { AnimatedCharacterCount } from '@/components/ui/form/AnimatedCharacterCount';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { AuthFloatingInputProps, FormFloatingInputProps } from '@/types';

// Type guard to check if it's a form variant (has icon and event-based onChange)
function isFormVariant(props: AuthFloatingInputProps | FormFloatingInputProps): props is FormFloatingInputProps {
  return 'icon' in props && typeof (props as FormFloatingInputProps).onChange === 'function';
}

const FloatingInput = forwardRef<HTMLInputElement, AuthFloatingInputProps | FormFloatingInputProps>(
  (props, ref) => {
    const {
      id,
      label,
      type = 'text',
      value,
      required = false,
      autoComplete,
      disabled = false,
      className,
      maxLength,
      error,
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    
    const hasValue = value.length > 0;
    const isFloating = isFocused || hasValue;
    const showCounter = maxLength && (isFocused || hasValue);
    
    // Determine if this is form variant
    const isForm = isFormVariant(props);
    const icon = isForm ? props.icon : undefined;

    useEffect(() => {
      if (error && inputRef.current) {
        inputRef.current.focus();
      }
    }, [error]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (isForm) {
        props.onChange(e);
      } else {
        props.onChange(e.target.value);
      }
    };

    return (
      <div className={cn('group relative', className)}>
        <div className="relative">
          {/* Icon (form variant only) */}
          {icon && (
            <div
              className={cn(
                'absolute left-3 top-1/2 z-10 -translate-y-1/2 transform transition-all duration-300',
                isFloating ? 'scale-95 text-primary' : 'text-muted-foreground',
                disabled && 'opacity-50'
              )}
            >
              {icon}
            </div>
          )}

          {/* Input Field */}
          {isForm ? (
            <Input
              ref={ref ?? inputRef}
              id={id}
              type={type}
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder=""
              maxLength={maxLength}
              required={required}
              disabled={disabled}
              autoComplete={autoComplete}
              className={cn(
                'peer h-14 bg-background/60 pb-2 pt-6 backdrop-blur-sm transition-all duration-300 hover:bg-background/70 focus:bg-background/80 focus:shadow-lg focus:shadow-primary/10',
                icon ? 'pl-11' : 'pl-4',
                maxLength ? 'pr-16' : 'pr-4',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            />
          ) : (
            <input
              ref={ref ?? inputRef}
              id={id}
              type={type}
              value={value}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              autoComplete={autoComplete}
              disabled={disabled}
              required={required}
              maxLength={maxLength}
              className={cn(
                'peer h-10 w-full rounded-xl border bg-input/20 px-3 py-2 outline-none transition-all duration-300',
                'focus:border-primary focus:bg-input/30 focus:ring-2 focus:ring-primary/20',
                'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                error
                  ? 'border-destructive focus:border-destructive focus:ring-destructive/20 focus-visible:ring-destructive focus-visible:ring-offset-2'
                  : 'hover:border-primary/50',
                disabled && 'cursor-not-allowed opacity-50'
              )}
            />
          )}

          {/* Label */}
          <label
            htmlFor={id}
            className={cn(
              'pointer-events-none absolute select-none font-medium transition-all duration-300',
              icon ? 'left-11' : (isForm ? 'left-4' : 'left-3'),
              isForm && isFloating
                ? 'top-2 text-xs text-primary'
                : !isForm && !hasValue
                ? 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground'
                : isForm
                ? 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground'
                : 'sr-only', // Hide label for auth variant when there's value
              error && !isForm && 'text-destructive',
              disabled && 'opacity-50'
            )}
          >
            {label}
            {required && !isForm && <span className="ml-1 text-destructive">*</span>}
          </label>

          {/* Character counter (form variant only) */}
          {showCounter && isForm && (
            <div className="absolute right-3 top-1/2 z-10 -translate-y-1/2 transform">
              <AnimatedCharacterCount current={value.length} max={maxLength!} />
            </div>
          )}
        </div>

        {/* Error message (auth variant) */}
        {error && !isForm && (
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