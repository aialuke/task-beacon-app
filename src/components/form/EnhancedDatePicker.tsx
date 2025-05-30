import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useState } from 'react';

interface EnhancedDatePickerProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EnhancedDatePicker({
  value,
  onChange,
}: EnhancedDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const selectedDate = value ? new Date(value) : undefined;
  const hasValue = !!selectedDate;
  const isFloating = isFocused || hasValue;

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const isoString = date.toISOString();
      const localDateTime = isoString.slice(0, 16);

      const syntheticEvent = {
        target: { value: localDateTime },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }
    setIsOpen(false);
  };

  return (
    <div className="group relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              'h-14 w-full justify-start rounded-2xl border-border/40 bg-background/60 px-4 pb-2 pt-6 text-left font-normal backdrop-blur-sm transition-all duration-300 hover:border-border/60 hover:bg-background/70 focus:border-primary/60 focus:bg-background/80 focus:shadow-lg focus:shadow-primary/10',
              !selectedDate && 'text-muted-foreground/70'
            )}
          >
            <CalendarIcon
              className={cn(
                'absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-all duration-300',
                isFloating ? 'scale-95 text-primary' : 'text-muted-foreground'
              )}
            />

            <div className="w-full pl-7">
              <div
                className={cn(
                  'pointer-events-none absolute left-11 select-none font-medium transition-all duration-300',
                  isFloating
                    ? 'top-2 text-xs text-primary'
                    : 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground'
                )}
              >
                Due Date
              </div>

              {selectedDate && (
                <div className="pt-2 text-sm font-medium text-foreground">
                  {format(selectedDate, 'MMM d, yyyy')}
                </div>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto border-border/60 bg-background/95 p-0 shadow-2xl backdrop-blur-lg"
          align="start"
          sideOffset={8}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date()}
            initialFocus
            className={cn('pointer-events-auto p-4')}
          />
        </PopoverContent>
      </Popover>

      {/* Enhanced focus ring */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 rounded-2xl transition-all duration-300',
          (isFocused || isOpen) &&
            'ring-2 ring-primary/30 ring-offset-2 ring-offset-background'
        )}
      />
    </div>
  );
}
