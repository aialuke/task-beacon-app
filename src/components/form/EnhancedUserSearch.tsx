import UserSearchInput from '@/components/UserSearchInput';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedUserSearchProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function EnhancedUserSearch({
  value,
  onChange,
  disabled = false,
}: EnhancedUserSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = !!value;
  const isFloating = isFocused || hasValue;

  return (
    <div className="group relative">
      <div className="relative">
        <UserSearchInput
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder=""
          className={cn(
            'h-14 rounded-2xl border-border/40 bg-background/60 pb-2 pl-4 pr-4 pt-6 backdrop-blur-sm transition-all duration-300 hover:border-border/60 hover:bg-background/70 focus:border-primary/60 focus:bg-background/80 focus:shadow-lg focus:shadow-primary/10'
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <label
          className={cn(
            'pointer-events-none absolute left-11 select-none font-medium transition-all duration-300',
            isFloating
              ? 'top-2 text-xs text-primary'
              : 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground'
          )}
        >
          Assign to
        </label>
      </div>

      {/* Enhanced focus ring */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-2xl transition-all duration-300',
          isFocused &&
            'ring-2 ring-primary/30 ring-offset-2 ring-offset-background'
        )}
      />
    </div>
  );
}
