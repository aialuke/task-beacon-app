import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FloatingTextareaProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  icon?: ReactNode;
  className?: string;
  error?: string; // Add error prop
  placeholder?: string;
}

export function FloatingTextarea({
  id,
  value,
  onChange,
  label,
  icon,
  className,
  error, // Destructure error
  placeholder,
}: FloatingTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(112, textareaRef.current.scrollHeight)}px`;
    }
  }, [value]);

  return (
    <div className={cn("relative group", className)}>
      <div className="relative">
        {icon && (
          <div className={cn(
            "absolute left-3 top-3 z-10 transition-all duration-300",
            isFloating ? "text-primary scale-95" : "text-muted-foreground"
          )}>
            {icon}
          </div>
        )}
        
        <Textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder} // Use the placeholder prop
          rows={1}
          className={cn(
            "peer min-h-28 pt-6 pb-2 bg-background/60 backdrop-blur-sm border-border/40 rounded-2xl transition-all duration-300 focus:bg-background/80 focus:border-primary/60 focus:shadow-lg focus:shadow-primary/10 hover:bg-background/70 hover:border-border/60 resize-none overflow-hidden",
            error && "border-destructive focus:border-destructive", // Add error styling
            icon ? "pl-11" : "pl-4",
            "pr-4"
          )}
        />
        
        <label
          htmlFor={id}
          className={cn(
            "absolute transition-all duration-300 pointer-events-none select-none font-medium",
            icon ? "left-11" : "left-4",
            isFloating
              ? "top-2 text-xs text-primary"
              : "top-3 text-sm text-muted-foreground",
            error && "text-destructive" // Add error styling to label
          )}
        >
          {label}
        </label>
      </div>

      {/* Elegant focus ring with animation */}
      <div className={cn(
        "absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none",
        isFocused && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
      )} />

      {/* Render error message if present */}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

FloatingTextarea.displayName = "FloatingTextarea";