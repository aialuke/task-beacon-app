
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
  type?: string;
  icon?: React.ReactNode;
  maxLength?: number;
  required?: boolean;
  className?: string;
}

export function FloatingInput({
  id,
  value,
  onChange,
  placeholder,
  label,
  type = "text",
  icon,
  maxLength,
  required = false,
  className
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  return (
    <div className={cn("relative group", className)}>
      <div className="relative">
        {icon && (
          <div className={cn(
            "absolute left-3 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-300",
            isFloating ? "text-primary scale-95" : "text-muted-foreground"
          )}>
            {icon}
          </div>
        )}
        
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          required={required}
          placeholder=""
          className={cn(
            "peer h-14 pt-6 pb-2 bg-background/60 backdrop-blur-sm border-border/40 rounded-2xl transition-all duration-300 focus:bg-background/80 focus:border-primary/60 focus:shadow-lg focus:shadow-primary/10 hover:bg-background/70 hover:border-border/60",
            icon ? "pl-11 pr-4" : "px-4",
            maxLength ? "pr-16" : ""
          )}
        />
        
        <label
          htmlFor={id}
          className={cn(
            "absolute left-4 transition-all duration-300 pointer-events-none select-none font-medium",
            icon && "left-11",
            isFloating
              ? "top-2 text-xs text-primary"
              : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
          )}
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>

        {maxLength && (
          <div className={cn(
            "absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium transition-all duration-300",
            value.length > maxLength * 0.8 
              ? value.length >= maxLength 
                ? "text-destructive scale-105" 
                : "text-warning scale-102"
              : "text-muted-foreground/60"
          )}>
            <span className={cn(
              "transition-colors duration-200",
              value.length >= maxLength && "text-destructive"
            )}>
              {value.length}
            </span>
            <span className="text-muted-foreground/40">/{maxLength}</span>
          </div>
        )}
      </div>

      {/* Elegant focus ring with animation */}
      <div className={cn(
        "absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none",
        isFocused && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
      )} />
    </div>
  );
}
