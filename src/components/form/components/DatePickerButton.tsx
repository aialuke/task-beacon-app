import { Calendar } from 'lucide-react';
import { memo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerButtonProps {
  dueDate: string;
  onDueDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const DatePickerButton = memo(function DatePickerButton({
  dueDate,
  onDueDateChange,
  disabled = false,
}: DatePickerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedDate: Date | undefined = dueDate
    ? new Date(dueDate)
    : undefined;
  const hasDate = !!selectedDate;

  const handleDateSelect = (date: Date | undefined): void => {
    if (date) {
      // Fix timezone issue by creating a local datetime string
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const localDateTime = `${year}-${month}-${day}T12:00`;

      const syntheticEvent = {
        target: { value: localDateTime },
      } as React.ChangeEvent<HTMLInputElement>;

      onDueDateChange(syntheticEvent);
    }
    setIsOpen(false);
  };

  const buttonClasses = cn(
    'flex touch-manipulation items-center justify-center gap-2 transition-all duration-200',
    'hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-95',
    'size-[48px] sm:h-[48px] sm:w-auto sm:py-2 sm:pl-3 sm:pr-4',
    'aspect-square rounded-full [aspect-ratio:1/1] sm:aspect-auto sm:[aspect-ratio:unset]',
    hasDate
      ? 'border border-primary/30 bg-primary/20 text-primary shadow-md shadow-primary/10'
      : 'border border-border/40 bg-background/60 text-muted-foreground hover:border-border/60 hover:bg-background/80 hover:text-foreground',
    disabled && 'cursor-not-allowed opacity-50 hover:scale-100'
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          disabled={disabled}
          className={buttonClasses}
        >
          <Calendar
            className={cn(
              'size-5 flex-shrink-0 transition-all duration-200 sm:size-4',
              hasDate && 'scale-110'
            )}
          />
          <span className="hidden whitespace-nowrap text-sm font-medium sm:inline">
            {hasDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Due Date'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto border-border bg-popover p-0 text-popover-foreground shadow-lg"
        align="start"
        sideOffset={8}
      >
        <CalendarComponent
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={(date: Date) => date < new Date()}
          initialFocus
          className="pointer-events-auto p-4"
        />
      </PopoverContent>
    </Popover>
  );
});
