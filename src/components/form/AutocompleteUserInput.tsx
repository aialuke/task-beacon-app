
import { useState, useRef, useMemo, useEffect } from 'react';
import { User as UserIcon, ArrowRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUsersQuery } from '@/features/users/hooks/useUsersQuery';

interface AutocompleteUserInputProps {
  value: string; // user ID when selected, empty when not
  onChange: (userId: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

type ValidationState = 'valid' | 'invalid' | 'partial' | 'empty';

export function AutocompleteUserInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search and select user...',
  disabled = false,
  className,
}: AutocompleteUserInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { users, isLoading } = useUsersQuery();
  
  // Find selected user
  const selectedUser = useMemo(() => 
    users.find(user => user.id === value), 
    [users, value]
  );

  // Find exact match for typed input
  const exactMatch = useMemo(() => {
    if (!inputValue.trim() || selectedUser) return null;
    
    const searchTerm = inputValue.toLowerCase().trim();
    return users.find(user => {
      const displayName = user.name || user.email.split('@')[0];
      return displayName.toLowerCase() === searchTerm || 
             user.email.toLowerCase() === searchTerm;
    });
  }, [users, inputValue, selectedUser]);

  // Auto-select exact matches
  useEffect(() => {
    if (exactMatch && !selectedUser) {
      onChange(exactMatch.id);
      setInputValue('');
      // Keep focus on input after selection
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [exactMatch, selectedUser, onChange]);

  // Find the best matching suggestion for ghost text
  const ghostSuggestion = useMemo(() => {
    if (!inputValue.trim() || selectedUser || exactMatch) return null;
    
    const searchTerm = inputValue.toLowerCase();
    const match = users.find(user => {
      const displayName = user.name || user.email.split('@')[0];
      return displayName.toLowerCase().startsWith(searchTerm) || 
             user.email.toLowerCase().startsWith(searchTerm);
    });
    
    return match;
  }, [users, inputValue, selectedUser, exactMatch]);

  // Generate ghost text completion
  const ghostText = useMemo(() => {
    if (!ghostSuggestion || !inputValue) return '';
    
    const displayName = ghostSuggestion.name || ghostSuggestion.email.split('@')[0];
    const email = ghostSuggestion.email;
    
    // Check if input matches start of name or email
    if (displayName.toLowerCase().startsWith(inputValue.toLowerCase())) {
      return displayName.slice(inputValue.length);
    } else if (email.toLowerCase().startsWith(inputValue.toLowerCase())) {
      return email.slice(inputValue.length);
    }
    
    return '';
  }, [ghostSuggestion, inputValue]);

  // Determine validation state
  const validationState: ValidationState = useMemo(() => {
    if (selectedUser) return 'valid';
    if (!inputValue.trim()) return 'empty';
    if (ghostSuggestion) return 'partial';
    return 'invalid';
  }, [selectedUser, inputValue, ghostSuggestion]);

  // Auto-focus input after user selection
  useEffect(() => {
    if (selectedUser && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Don't clear selection when typing - let the user keep typing to search
    // Selection will only be cleared via backspace when input is empty
  };

  const handleAcceptSuggestion = () => {
    if (ghostSuggestion) {
      onChange(ghostSuggestion.id);
      setInputValue('');
      // Keep focus on input after selection
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleClearUser = () => {
    onChange('');
    setInputValue('');
    // Ensure input stays focused
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        // First check: if there's a ghost suggestion and no user selected, select the user
        if (ghostSuggestion && ghostText && !selectedUser) {
          e.preventDefault();
          e.stopPropagation();
          handleAcceptSuggestion();
        }
        // Second case: if user is already selected and onSubmit is provided, call onSubmit
        else if (selectedUser && onSubmit) {
          e.preventDefault();
          e.stopPropagation();
          onSubmit();
        }
        break;
      case 'Escape':
        setInputValue('');
        inputRef.current?.blur();
        break;
      case 'Backspace':
        // If input is empty and user is selected, clear the user
        if (selectedUser && !inputValue) {
          e.preventDefault();
          handleClearUser();
        }
        break;
    }
  };

  const getBorderColor = () => {
    if (disabled) return 'border-border/40';
    if (selectedUser) return 'border-green-500';
    if (!isFocused && validationState === 'empty') return 'border-border/40';
    
    switch (validationState) {
      case 'valid': return 'border-green-500';
      case 'invalid': return 'border-red-500';
      case 'partial': return 'border-yellow-500';
      default: return 'border-border/60';
    }
  };

  const getStatusIcon = () => {
    if (selectedUser) return <UserIcon className="h-4 w-4 text-green-500" />;
    switch (validationState) {
      case 'invalid': return <UserIcon className="h-4 w-4 text-red-500" />;
      default: return <UserIcon className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Show placeholder only when no input, not focused, and no user selected
  const showPlaceholder = !inputValue && !isFocused && !selectedUser;

  return (
    <div className={cn('relative w-full', className)}>
      <div className="group relative">
        <div
          className={cn(
            'flex h-12 items-center rounded-2xl border bg-background/60 p-2 backdrop-blur-sm transition-all duration-300',
            'hover:border-border/60 hover:bg-background/70',
            isFocused && 'bg-background/80',
            getBorderColor(),
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          {getStatusIcon()}

          <div className="flex-1 min-w-0 ml-3 flex items-center gap-2">
            {/* User tag - displayed inline for selected user */}
            {selectedUser && (
              <div className="flex items-center bg-primary/10 text-primary px-2 py-1 text-sm">
                <span>{selectedUser.name || selectedUser.email.split('@')[0]}</span>
                <button
                  type="button"
                  className="ml-1 text-primary/70 hover:text-primary"
                  onClick={handleClearUser}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {/* Input container with ghost text */}
            <div className="relative flex-1 min-w-0">
              {/* Ghost text overlay */}
              {ghostText && isFocused && !selectedUser && (
                <div className="absolute inset-0 pointer-events-none flex items-center">
                  <span className="text-sm text-foreground font-semibold select-none">
                    {inputValue}
                  </span>
                  <span className="text-sm text-muted-foreground/70 select-none">
                    {ghostText}
                  </span>
                </div>
              )}
              
              {/* Actual input */}
              <Input
                ref={inputRef}
                type="text"
                placeholder=""
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => { setIsFocused(true); }}
                onBlur={() => { setIsFocused(false); }}
                className="h-auto border-none bg-transparent p-0 py-3 pl-0 pr-0 text-sm text-foreground font-semibold focus:ring-0 focus-visible:ring-0 relative z-10"
                disabled={disabled}
              />
            </div>
          </div>

          {/* Arrow icon for confirmation */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-2 h-8 w-8 p-0 transition-colors"
            onClick={selectedUser ? onSubmit : handleAcceptSuggestion}
            disabled={disabled || (!ghostSuggestion && !selectedUser)}
          >
            <ArrowRight 
              className={cn(
                "h-4 w-4 transition-colors",
                selectedUser ? "text-primary" : "text-muted-foreground"
              )} 
            />
          </Button>
        </div>

        {/* Placeholder */}
        {showPlaceholder && (
          <label
            className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 select-none text-sm text-muted-foreground"
          >
            {placeholder}
          </label>
        )}
      </div>
    </div>
  );
}
