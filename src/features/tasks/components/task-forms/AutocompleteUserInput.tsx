/**
 * Autocomplete User Input - Refactored Main Component
 *
 * Streamlined user autocomplete component using focused modules.
 * Uses modular architecture for better maintainability and testability.
 */

import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import {
  type AutocompleteUserInputProps,
  useAutocompleteLogic,
  getBorderColor,
  shouldShowPlaceholder,
  AutocompleteUserTag,
  AutocompleteStatusIcon,
} from './autocomplete';

export function AutocompleteUserInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search and select user...',
  disabled = false,
  className,
}: AutocompleteUserInputProps) {
  const logic = useAutocompleteLogic({ value, onChange, onSubmit });

  const borderColor = getBorderColor(
    disabled,
    logic.selectedUser,
    logic.isFocused,
    logic.validationState,
  );

  const showPlaceholder = shouldShowPlaceholder(
    logic.inputValue,
    logic.isFocused,
    logic.selectedUser,
  );

  return (
    <div className={cn('relative w-full', className)}>
      <div className="group relative">
        <div
          className={cn(
            'flex h-12 items-center rounded-2xl border bg-background/60 p-2 backdrop-blur-sm transition-all duration-300',
            'focus-within:bg-background/75 hover:border-border/60 hover:bg-background/70 active:bg-background/75',
            logic.isFocused && 'bg-background/80',
            borderColor,
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <AutocompleteStatusIcon
            selectedUser={logic.selectedUser}
            validationState={logic.validationState}
          />

          <div className="ml-3 flex min-w-0 flex-1 items-center gap-2">
            {/* User tag - displayed inline for selected user */}
            {logic.selectedUser && (
              <AutocompleteUserTag
                user={logic.selectedUser}
                onClear={logic.handleClearUser}
                disabled={disabled}
              />
            )}

            {/* Input container with ghost text */}
            <div className="relative min-w-0 flex-1">
              {/* Ghost text overlay */}
              {logic.ghostText && logic.isFocused && !logic.selectedUser && (
                <div className="pointer-events-none absolute inset-0 flex items-center">
                  <span className="select-none text-sm font-semibold text-foreground">
                    {logic.inputValue}
                  </span>
                  <span className="select-none text-sm text-muted-foreground/70">
                    {logic.ghostText}
                  </span>
                </div>
              )}

              {/* Actual input */}
              <Input
                ref={logic.inputRef}
                type="text"
                placeholder=""
                value={logic.inputValue}
                onChange={logic.handleInputChange}
                onKeyDown={logic.handleKeyDown}
                onFocus={() => {
                  logic.setIsFocused(true);
                }}
                onBlur={() => {
                  logic.setIsFocused(false);
                }}
                className="relative z-10 h-auto border-none bg-transparent p-0 py-3 text-sm font-semibold text-foreground focus:ring-0 focus-visible:ring-0"
                disabled={disabled}
              />
            </div>
          </div>

          {/* Arrow icon for confirmation */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-2 size-8 p-0 transition-colors"
            onClick={
              logic.selectedUser ? onSubmit : logic.handleAcceptSuggestion
            }
            disabled={
              disabled || (!logic.ghostSuggestion && !logic.selectedUser)
            }
          >
            <ArrowRight
              className={cn(
                'size-4 transition-colors',
                logic.selectedUser ? 'text-primary' : 'text-muted-foreground',
              )}
            />
          </Button>
        </div>

        {/* Placeholder */}
        {showPlaceholder && (
          <label className="pointer-events-none absolute left-11 top-1/2 -translate-y-1/2 select-none text-sm text-muted-foreground">
            {placeholder}
          </label>
        )}
      </div>
    </div>
  );
}
