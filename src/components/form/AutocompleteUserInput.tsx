
import { useState, useRef, useEffect, useMemo } from 'react';
import { User as UserIcon, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUsersQuery } from '@/features/users/hooks/useUsersQuery';
import UserProfile from '@/features/users/components/UserProfile';

interface AutocompleteUserInputProps {
  value: string; // user ID when selected, empty when not
  onChange: (userId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

type ValidationState = 'valid' | 'invalid' | 'partial' | 'empty';

export function AutocompleteUserInput({
  value,
  onChange,
  placeholder = 'Search and select user...',
  disabled = false,
  className,
}: AutocompleteUserInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  
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
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Tab':
      case 'ArrowRight':
        if (ghostSuggestion && ghostText) {
          e.preventDefault();
          handleAcceptSuggestion();
        }
        break;
      case 'Enter':
        if (ghostSuggestion) {
          e.preventDefault();
          handleAcceptSuggestion();
        }
        break;
      case 'Escape':
        setInputValue('');
        inputRef.current?.blur();
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
    if (selectedUser) return <Check className="h-4 w-4 text-green-500" />;
    switch (validationState) {
      case 'invalid': return <X className="h-4 w-4 text-red-500" />;
      default: return <UserIcon className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const isFloating = isFocused || selectedUser || inputValue;

  // If user is selected, show Facebook-style tag
  if (selectedUser) {
    return (
      <div className={cn('relative w-full', className)}>
        <div className="group relative">
          <div
            className={cn(
              'flex h-12 items-center rounded-2xl border bg-primary text-primary-foreground p-2 transition-all duration-300',
              'hover:bg-primary/90',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <Check className="h-4 w-4 mr-2" />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium truncate">
                {selectedUser.name || selectedUser.email.split('@')[0]}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-2 h-6 w-6 p-0 text-primary-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/20"
              onClick={handleClear}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Floating label for selected state */}
          <label className="pointer-events-none absolute left-11 top-2 select-none text-xs font-medium text-primary-foreground/80">
            {placeholder}
          </label>
        </div>
      </div>
    );
  }

  // Normal input state with ghost text
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
            {/* Ghost text overlay */}
            {ghostText && isFocused && (
              <div
                ref={ghostRef}
                className="absolute inset-0 pointer-events-none flex items-center"
                style={{ paddingTop: '1.5rem', paddingBottom: '0.5rem' }}
              >
                <span className="text-sm text-transparent select-none">
                  {inputValue}
                </span>
                <span className="text-sm text-muted-foreground/60 select-none">
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
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="h-auto border-none bg-transparent p-0 pb-2 pl-0 pr-0 pt-6 text-sm text-foreground focus:ring-0 relative z-10"
              disabled={disabled}
            />
          </div>
        </div>

        {/* Floating label */}
        <label
          className={cn(
            'pointer-events-none absolute left-11 select-none font-medium transition-all duration-300',
            isFloating
              ? 'top-2 text-xs text-primary'
              : 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground'
          )}
        >
          {placeholder}
        </label>

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
