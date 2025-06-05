
import { useState, useRef, useMemo } from 'react';
import { User as UserIcon, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUsersQuery } from '@/features/users/hooks/useUsersQuery';

interface AutocompleteUserInputProps {
  value: string; // user ID when selected, empty when not
  onChange: (userId: string) => void;
  onSubmit?: () => void; // New prop for handling submission
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
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  
  const { users, isLoading } = useUsersQuery();
  
  // Find selected user
  const selectedUser = useMemo(() => 
    users.find(user => user.id === value), 
    [users, value]
  );

  // Find the best matching suggestion for ghost text
  const ghostSuggestion = useMemo(() => {
    if (!inputValue.trim() || selectedUser) return null;
    
    const searchTerm = inputValue.toLowerCase();
    const match = users.find(user => {
      const displayName = user.name || user.email.split('@')[0];
      return displayName.toLowerCase().startsWith(searchTerm) || 
             user.email.toLowerCase().startsWith(searchTerm);
    });
    
    return match;
  }, [users, inputValue, selectedUser]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Clear selection if user starts typing
    if (selectedUser) {
      onChange('');
    }
  };

  const handleAcceptSuggestion = () => {
    if (ghostSuggestion) {
      onChange(ghostSuggestion.id);
      setInputValue('');
    }
  };

  const handleClear = () => {
    onChange('');
    setInputValue('');
    // Focus the appropriate input based on state
    if (selectedUser) {
      hiddenInputRef.current?.focus();
    } else {
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        // First check: if there's a ghost suggestion and no user selected, select the user
        if (ghostSuggestion && ghostText && !selectedUser) {
          e.preventDefault();
          e.stopPropagation(); // Prevent form submission
          handleAcceptSuggestion();
        }
        // Second case: if user is already selected and onSubmit is provided, call onSubmit
        else if (selectedUser && onSubmit) {
          e.preventDefault();
          e.stopPropagation();
          onSubmit();
        }
        // Third case: if user is selected but no onSubmit, allow normal form submission
        break;
      case 'Escape':
        setInputValue('');
        if (selectedUser) {
          hiddenInputRef.current?.blur();
        } else {
          inputRef.current?.blur();
        }
        break;
      case 'Backspace':
        if (selectedUser && !inputValue) {
          e.preventDefault();
          handleClear();
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

  // Show placeholder only when field is empty and not focused and no user selected
  const showPlaceholder = !inputValue && !isFocused && !selectedUser;

  // Selected state with hidden input for backspace functionality
  if (selectedUser) {
    return (
      <div className={cn('relative w-full', className)}>
        <div className="group relative">
          <div
            className={cn(
              'flex h-12 items-center rounded-2xl border bg-background/60 p-2 backdrop-blur-sm transition-all duration-300',
              'hover:border-border/60 hover:bg-background/70',
              'border-border/40',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <UserIcon className="h-4 w-4 mr-3 text-muted-foreground" />
            
            <div className="flex-1 min-w-0 relative">
              {/* Selected user with proper centering */}
              <div className="py-3 flex items-center">
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-md">
                  {selectedUser.name || selectedUser.email.split('@')[0]}
                </span>
              </div>
              
              {/* Hidden input for backspace functionality */}
              <input
                ref={hiddenInputRef}
                type="text"
                className="absolute inset-0 opacity-0 cursor-text"
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
                autoFocus
              />
            </div>

            {/* Blue arrow icon for submission */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-2 h-8 w-8 p-0 transition-colors"
              onClick={onSubmit}
              disabled={disabled}
            >
              <ArrowRight className="h-4 w-4 text-primary" />
            </Button>
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
      </div>
    );
  }

  // Normal input state with enhanced ghost text and arrow icon
  return (
    <div className={cn('relative w-full', className)}>
      <div className="group relative">
        <div
          className={cn(
            'flex h-12 items-center rounded-2xl border bg-background/60 p-2 backdrop-blur-sm transition-all duration-300',
            'hover:border-border/60 hover:bg-background/70',
            isFocused && 'bg-background/80 shadow-lg shadow-primary/10',
            getBorderColor(),
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          {getStatusIcon()}

          <div className="relative flex-1 ml-3">
            {/* Enhanced ghost text overlay with better contrast */}
            {ghostText && isFocused && (
              <div
                className="absolute inset-0 pointer-events-none flex items-center"
                style={{ paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
              >
                <span className="text-sm text-foreground font-semibold select-none">
                  {inputValue}
                </span>
                <span className="text-sm text-muted-foreground/70 select-none">
                  {ghostText}
                </span>
              </div>
            )}
            
            {/* Actual input with proper vertical centering */}
            <Input
              ref={inputRef}
              type="text"
              placeholder=""
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="h-auto border-none bg-transparent p-0 py-3 pl-0 pr-0 text-sm text-foreground font-semibold focus:ring-0 relative z-10"
              disabled={disabled}
            />
          </div>

          {/* Arrow icon for confirmation - blue when ghost suggestion is available OR user is selected */}
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
                (ghostSuggestion && ghostText) || selectedUser ? "text-primary" : "text-muted-foreground"
              )} 
            />
          </Button>
        </div>

        {/* Simple placeholder - show/hide without animation */}
        {showPlaceholder && (
          <label
            className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 select-none text-sm text-muted-foreground"
          >
            {placeholder}
          </label>
        )}

        {/* Enhanced focus ring */}
        <div
          className={cn(
            'pointer-events-none absolute inset-0 rounded-2xl transition-all duration-300',
            isFocused &&
              'ring-2 ring-primary/30 ring-offset-2 ring-offset-background'
          )}
        />
      </div>
    </div>
  );
}
