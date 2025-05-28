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
  className?: string; // Added className prop
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
  className, // Added to props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFloating = isFocused || value.length > 0;

  useEffect(() => {
    if (error && inputRef.current) {
      inputRef.current.focus();
    }
  }, [error]);

  return (
    <div className="relative group">
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
          "peer w-full h-10 px-3 pt-5 pb-1 bg-background/20 backdrop-blur-sm border rounded-xl transition-all duration-300 outline-none", // Changed h-14 to h-10, px-4 to px-3, pt-6 to pt-5, pb-2 to pb-1
          "focus:bg-background/30 focus:border-primary focus:ring-2 focus:ring-primary/20",
          "placeholder-transparent",
          error 
            ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
            : "border-border hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed",
          className // Added className to allow overrides
        )}
        placeholder={label}
      />
      
      <label
        htmlFor={id}
        className={cn(
          "absolute left-3 transition-all duration-300 pointer-events-none", // Changed left-4 to left-3
          "text-muted-foreground",
          isFloating
            ? "top-1.5 text-xs font-medium" // Changed top-2 to top-1.5
            : "top-1/2 -translate-y-1/2 text-sm", // Changed text-base to text-sm
          isFocused && "text-primary",
          error && "text-destructive"
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>

      {error && (
        <p className="mt-1 text-xs text-destructive animate-fade-in"> {/* Changed mt-2 to mt-1, text-sm to text-xs */}
          {error}
        </p>
      )}
    </div>
  );
};