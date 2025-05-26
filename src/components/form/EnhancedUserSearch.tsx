
import UserSearchInput from "@/components/UserSearchInput";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EnhancedUserSearchProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function EnhancedUserSearch({ value, onChange, disabled = false }: EnhancedUserSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = !!value;
  const isFloating = isFocused || hasValue;

  return (
    <div className="relative group">
      <div className="relative">
        <UserSearchInput
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder=""
          className={cn(
            "h-14 pt-6 pb-2 pl-4 pr-4 bg-background/60 backdrop-blur-sm border-border/40 rounded-2xl transition-all duration-300 focus:bg-background/80 focus:border-primary/60 focus:shadow-lg focus:shadow-primary/10 hover:bg-background/70 hover:border-border/60"
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        <label className={cn(
          "absolute left-11 transition-all duration-300 pointer-events-none select-none font-medium",
          isFloating
            ? "top-2 text-xs text-primary"
            : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
        )}>
          Assign to
        </label>
      </div>

      {/* Enhanced focus ring */}
      <div className={cn(
        "absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none",
        isFocused && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
      )} />
    </div>
  );
}
