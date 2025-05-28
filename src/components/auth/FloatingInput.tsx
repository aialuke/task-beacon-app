import React, { useState, useRef, useEffect } from 'react';
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

export const FloatingInput: React.FC<FloatingInputProps> = ({
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
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Label is visible only when the input is not focused and has no value
  const showLabel = !isFocused && value.length === 0;

  useEffect(() => {
    if (error && inputRef.current) {
      inputRef.current.focus();
    }
  }, [error]);

  return (
    <div className="relative group">
      {showLabel && (
        <label
          htmlFor={id}
          className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground pointer-events-none", // Label inside input
            error && "text-destructive"
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoComplete={autoComplete}
        disabled={disabled}
        required={required}
        className={cn(
          "peer w-full h-10 px-3 py-2 bg-background/20 backdrop-blur-sm border rounded-xl transition-all duration-300 outline-none",
          "focus:bg-background/30 focus:border-primary focus:ring-2 focus:ring-primary/20",
          "placeholder-transparent",
          error 
            ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
            : "border-border hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      />
      
      {error && (
        <p className="mt-1 text-xs text-destructive animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};