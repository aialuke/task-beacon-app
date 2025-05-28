
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
          "peer w-full h-14 px-4 pt-6 pb-2 bg-background/20 backdrop-blur-sm border rounded-xl transition-all duration-300 outline-none",
          "focus:bg-background/30 focus:border-primary focus:ring-2 focus:ring-primary/20",
          "placeholder-transparent",
          error 
            ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
            : "border-border hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        placeholder={label}
      />
      
      <label
        htmlFor={id}
        className={cn(
          "absolute left-4 transition-all duration-300 pointer-events-none",
          "text-muted-foreground",
          isFloating
            ? "top-2 text-xs font-medium"
            : "top-1/2 -translate-y-1/2 text-base",
          isFocused && "text-primary",
          error && "text-destructive"
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>

      {error && (
        <p className="mt-2 text-sm text-destructive animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};
