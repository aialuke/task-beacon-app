import { useState, ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { AnimatedCharacterCount } from "./AnimatedCharacterCount";

interface FloatingInputProps {
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  icon?: ReactNode;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FloatingInput({
  id,
  type = "text",
  value,
  onChange,
  label,
  icon,
  maxLength,
  required = false,
  disabled = false,
  className,
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;
  const showCounter = maxLength && (isFocused || hasValue);

  return (
    <div className={cn("group relative", className)}>
      <div className="relative">
        {icon && (
          <div
            className={cn(
              "absolute left-3 top-1/2 z-10 -translate-y-1/2 transform transition-all duration-300",
              isFloating ? "text-primary scale-95" : "text-muted-foreground",
              disabled && "opacity-50"
            )}
          >
            {icon}
          </div>
        )}

        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => { setIsFocused(true); }}
          onBlur={() => { setIsFocused(false); }}
          placeholder=""
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          className={cn(
            "bg-background/60 hover:bg-background/70 focus:bg-background/80 focus:shadow-primary/10 peer h-14 pb-2 pt-6 backdrop-blur-sm transition-all duration-300 focus:shadow-lg",
            icon ? "pl-11" : "pl-4",
            maxLength ? "pr-16" : "pr-4",
            disabled && "cursor-not-allowed opacity-50"
          )}
        />

        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute select-none font-medium transition-all duration-300",
            icon ? "left-11" : "left-4",
            isFloating
              ? "text-primary top-2 text-xs"
              : "text-muted-foreground top-1/2 -translate-y-1/2 text-sm",
            disabled && "opacity-50"
          )}
        >
          {label}
        </label>

        {/* Character counter inside input field */}
        {showCounter && (
          <div className="absolute right-3 top-1/2 z-10 -translate-y-1/2 transform">
            <AnimatedCharacterCount current={value.length} max={maxLength} />
          </div>
        )}
      </div>
    </div>
  );
}

export default FloatingInput;
