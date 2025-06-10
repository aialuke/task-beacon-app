/**
 * Simple Date Input - React 19 Compatible
 * 
 * Replaces the complex react-day-picker with a native HTML date input
 * for better performance and React 19 compatibility.
 */

import { Calendar } from 'lucide-react';
import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

interface SimpleDateInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  showIcon?: boolean;
}

const SimpleDateInput = forwardRef<HTMLInputElement, SimpleDateInputProps>(
  ({ 
    className, 
    value, 
    onValueChange, 
    onChange, 
    placeholder = "Select date",
    error,
    showIcon = true,
    disabled,
    ...props 
  }, ref) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onValueChange?.(newValue);
      onChange?.(e);
    };

    return (
      <div className="relative">
        {showIcon && (
          <Calendar 
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" 
          />
        )}
        <input
          type="date"
          ref={ref}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showIcon && "pl-10",
            error && "border-destructive",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

SimpleDateInput.displayName = "SimpleDateInput";

export { SimpleDateInput }; 