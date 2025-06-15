import { useState, useRef, useEffect, ReactNode } from 'react';

import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FloatingTextareaProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  label: string;
  icon?: ReactNode;
  className?: string;
}

export function FloatingTextarea({
  id,
  value,
  onChange,
  placeholder: _placeholder,
  label,
  icon,
  className,
}: FloatingTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasValue = value.length > 0;
  const isFloating = isFocused || hasValue;

  // Auto-expand textarea with doubled minimum height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(112, textareaRef.current.scrollHeight)}px`; // Doubled from 56 to 112
    }
  }, [value]);

  return (
    <div className={cn('group relative', className)}>
      <div className="relative">
        {icon && (
          <div
            className={cn(
              'absolute left-3 top-3 z-10 transition-all duration-300', // Changed from top-6 to top-3
              isFloating ? 'text-primary scale-95' : 'text-muted-foreground'
            )}
          >
            {icon}
          </div>
        )}

        <Textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => { setIsFocused(true); }}
          onBlur={() => { setIsFocused(false); }}
          placeholder=""
          rows={1}
          className={cn(
            'bg-background/60 hover:bg-background/70 focus:bg-background/80 focus:shadow-primary/10 peer min-h-28 resize-none overflow-hidden pb-2 pt-6 backdrop-blur-sm transition-all duration-300 focus:shadow-lg',
            icon ? 'pl-11' : 'pl-4',
            'pr-4'
          )}
        />

        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute select-none font-medium transition-all duration-300',
            icon ? 'left-11' : 'left-4',
            isFloating
              ? 'text-primary top-2 text-xs' // Keeps the floated label at top-2
              : 'text-muted-foreground top-3 text-sm' // Changed from top-6 to top-3 for better alignment
          )}
        >
          {label}
        </label>
      </div>
    </div>
  );
}
