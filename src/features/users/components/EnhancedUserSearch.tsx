import { useState, useRef, useEffect } from 'react';
import { User as UserIcon, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUsersQuery } from '../hooks/useUsersQuery';
import { useUsersFilter } from '../hooks/useUsersFilter';
import UserProfile from './UserProfile';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface EnhancedUserSearchProps {
  value: string;
  onChange: (userId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Enhanced user search component with improved UX
 */
export function EnhancedUserSearch({
  value,
  onChange,
  placeholder = 'Search users...',
  disabled = false,
  className,
}: EnhancedUserSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const { users, isLoading } = useUsersQuery();
  const filteredUsers = useUsersFilter(users, searchTerm, 5); // Limit to 5 results

  // Find selected user
  const selectedUser = users.find((user) => user.id === value);

  const handleSelect = (userId: string) => {
    onChange(userId);
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onChange('');
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (searchTerm || !selectedUser) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay closing to allow for clicks
    setTimeout(() => setIsOpen(false), 150);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isFloating = isFocused || selectedUser || searchTerm;

  return (
    <div className={cn('relative w-full', className)}>
      <div className="group relative">
        <div
          className={cn(
            'flex h-12 items-center rounded-2xl border border-border/40 bg-background/60 p-2 backdrop-blur-sm transition-all duration-300',
            'hover:border-border/60 hover:bg-background/70',
            isFocused &&
              'border-primary/60 bg-background/80 shadow-lg shadow-primary/10',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <UserIcon className="mr-3 h-5 w-5 flex-shrink-0 text-muted-foreground" />

          {selectedUser ? (
            <div className="flex w-full items-center justify-between">
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
            <>
              <Input
                ref={inputRef}
                type="text"
                placeholder=""
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="h-auto flex-1 border-none bg-transparent p-0 pb-2 pl-0 pr-0 pt-6 text-sm text-foreground focus:ring-0"
                disabled={disabled}
              />
              <Search className="ml-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </>
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

      {/* Dropdown */}
      {isOpen && !selectedUser && (
        <div
          ref={dropdownRef}
          className="absolute z-[9999] mt-2 w-full overflow-visible rounded-xl border border-border bg-popover shadow-lg"
        >
          <div className="flex flex-col p-2">
            {isLoading ? (
              <div className="py-3 text-center text-sm text-muted-foreground">
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-3 text-center text-sm text-muted-foreground">
                {searchTerm ? 'No users found' : 'No users available'}
              </div>
            ) : (
              <div className="w-full space-y-1">
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelect(user.id)}
                    className="w-full rounded-lg p-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                  >
                    <UserProfile user={user} compact />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
}

export function UserSearchModal({
  isOpen,
  onClose,
  value,
  onChange,
}: UserSearchModalProps) {
  const handleUserSelect = (selectedValue: string) => {
    onChange(selectedValue);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-md h-auto min-h-[200px]">
        <div className="flex flex-col space-y-2">
          <EnhancedUserSearch 
            value={value} 
            onChange={handleUserSelect}
            className="flex-grow"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
