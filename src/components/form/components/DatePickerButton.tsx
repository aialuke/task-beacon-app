
import { memo, useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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

  const selectedDate: Date | undefined = dueDate ? new Date(dueDate) : undefined;
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
    'flex items-center justify-center gap-2 transition-all duration-200 touch-manipulation',
    'hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
    'w-[48px] h-[48px] sm:w-auto sm:h-[48px] sm:pl-3 sm:pr-4 sm:py-2',
    'rounded-full aspect-square [aspect-ratio:1/1] sm:aspect-auto sm:[aspect-ratio:unset]',
    hasDate
      ? 'bg-primary/20 text-primary border border-primary/30 shadow-md shadow-primary/10'
      : 'bg-background/60 text-muted-foreground border border-border/40 hover:bg-background/80 hover:text-foreground hover:border-border/60',
    disabled && 'opacity-50 cursor-not-allowed hover:scale-100'
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" disabled={disabled} className={buttonClasses}>
          <Calendar
            className={cn(
              'h-5 w-5 flex-shrink-0 transition-all duration-200 sm:h-4 sm:w-4',
              hasDate && 'scale-110'
            )}
          />
          <span className="hidden whitespace-nowrap text-sm font-medium sm:inline">
            {hasDate ? format(selectedDate!, 'MMM d') : 'Due Date'}
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
