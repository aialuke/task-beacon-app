
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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { users, isLoading } = useUsersQuery();
  
  // Find selected user
  const selectedUser = useMemo(() => 
    users.find(user => user.id === value), 
    [users, value]
  );

  // Filter suggestions based on input
  const suggestions = useMemo(() => {
    if (!inputValue.trim() || selectedUser) return [];
    
    const searchTerm = inputValue.toLowerCase();
    return users
      .filter(user => {
        const displayName = user.name || user.email.split('@')[0];
        return displayName.toLowerCase().includes(searchTerm) || 
               user.email.toLowerCase().includes(searchTerm);
      })
      .slice(0, 5); // Limit to 5 suggestions
  }, [users, inputValue, selectedUser]);

  // Determine validation state
  const validationState: ValidationState = useMemo(() => {
    if (selectedUser) return 'valid';
    if (!inputValue.trim()) return 'empty';
    if (suggestions.length > 0) return 'partial';
    return 'invalid';
  }, [selectedUser, inputValue, suggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setFocusedIndex(-1);
    
    // Clear selection if user starts typing
    if (selectedUser) {
      onChange('');
    }
  };

  const handleUserSelect = (userId: string) => {
    onChange(userId);
    setInputValue('');
    setFocusedIndex(-1);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange('');
    setInputValue('');
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestions.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (focusedIndex >= 0 && suggestions[focusedIndex]) {
          handleUserSelect(suggestions[focusedIndex].id);
        } else if (suggestions.length === 1) {
          handleUserSelect(suggestions[0].id);
        }
        break;
      case 'Escape':
        setInputValue('');
        setFocusedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const getBorderColor = () => {
    if (disabled) return 'border-border/40';
    if (!isFocused && validationState === 'empty') return 'border-border/40';
    
    switch (validationState) {
      case 'valid': return 'border-green-500';
      case 'invalid': return 'border-red-500';
      case 'partial': return 'border-yellow-500';
      default: return 'border-border/60';
    }
  };

  const getStatusIcon = () => {
    switch (validationState) {
      case 'valid': return <Check className="h-4 w-4 text-green-500" />;
      case 'invalid': return <X className="h-4 w-4 text-red-500" />;
      default: return <UserIcon className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const isFloating = isFocused || selectedUser || inputValue;

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

          {selectedUser ? (
            <div className="flex w-full items-center justify-between ml-3">
              <UserProfile user={selectedUser} compact />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                onClick={handleClear}
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Input
              ref={inputRef}
              type="text"
              placeholder=""
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                // Small delay to allow suggestion clicks
                setTimeout(() => setFocusedIndex(-1), 150);
              }}
              className="h-auto flex-1 border-none bg-transparent p-0 pb-2 pl-3 pr-0 pt-6 text-sm text-foreground focus:ring-0"
              disabled={disabled}
            />
          )}
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

      {/* Inline suggestions */}
      {isFocused && suggestions.length > 0 && !selectedUser && (
        <div className="mt-2 space-y-1">
          <div className="text-xs text-muted-foreground px-2">
            {isLoading ? 'Loading...' : `${suggestions.length} user${suggestions.length === 1 ? '' : 's'} found`}
          </div>
          <div className="space-y-1">
            {suggestions.map((user, index) => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user.id)}
                className={cn(
                  'w-full rounded-lg p-2 text-left transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                  index === focusedIndex && 'bg-accent text-accent-foreground'
                )}
              >
                <UserProfile user={user} compact />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Validation feedback */}
      {isFocused && inputValue && !selectedUser && (
        <div className="mt-1 px-2">
          {validationState === 'invalid' && (
            <p className="text-xs text-red-500">No users found matching "{inputValue}"</p>
          )}
          {validationState === 'partial' && suggestions.length > 0 && (
            <p className="text-xs text-yellow-600">
              Press Enter to select {suggestions[0].name || suggestions[0].email.split('@')[0]}, or continue typing
            </p>
          )}
        </div>
      )}
    </div>
  );
}
