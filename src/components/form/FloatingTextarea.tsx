
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FloatingTextareaProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  label: string;
  className?: string;
}

export function FloatingTextarea({
  id,
  value,
  onChange,
  placeholder,
  label,
  className
}: FloatingTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(56, textareaRef.current.scrollHeight)}px`;
    }
  }, [value]);

  return (
    <div className={cn("relative group", className)}>
      <div className="relative">
        <Textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=""
          rows={1}
          className={cn(
            "peer min-h-14 pt-6 pb-2 px-4 bg-background/60 backdrop-blur-sm border-border/40 rounded-2xl transition-all duration-300 focus:bg-background/80 focus:border-primary/60 focus:shadow-lg focus:shadow-primary/10 hover:bg-background/70 hover:border-border/60 resize-none overflow-hidden"
          )}
        />
        
        <label
          htmlFor={id}
          className={cn(
            "absolute left-4 transition-all duration-300 pointer-events-none select-none font-medium",
            isFloating
              ? "top-2 text-xs text-primary"
              : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
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
    </div>
  );
}
