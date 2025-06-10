import { Calendar } from 'lucide-react';
import { memo } from 'react';

import { SimpleDateInput } from '@/components/ui/simple-date-input';
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
  const hasDate = !!dueDate;

  // Convert datetime-local to date format for input
  const dateValue = dueDate ? dueDate.split('T')[0] : '';

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    if (dateValue) {
      // Convert date to datetime-local format with noon time
      const syntheticEvent = {
        target: { value: `${dateValue}T12:00` },
      } as React.ChangeEvent<HTMLInputElement>;
      onDueDateChange(syntheticEvent);
    } else {
      onDueDateChange(e);
    }
  };

  return (
    <div className={cn(
      'flex items-center justify-center transition-all duration-200',
      'focus-within:ring-primary/30 hover:scale-105 focus-within:outline-none focus-within:ring-2',
      'size-[48px] sm:h-[48px] sm:w-auto sm:py-2 sm:pl-3 sm:pr-4',
      'aspect-square rounded-full [aspect-ratio:1/1] sm:aspect-auto sm:[aspect-ratio:unset]',
      hasDate
        ? 'bg-primary/20 text-primary border-primary/30 shadow-primary/10 border shadow-md'
        : 'bg-background/60 text-muted-foreground border-border/40 hover:bg-background/80 hover:text-foreground hover:border-border/60 border',
      disabled && 'cursor-not-allowed opacity-50 hover:scale-100'
    )}>
      <SimpleDateInput
        value={dateValue}
        onChange={handleDateChange}
        disabled={disabled}
        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        showIcon={false}
        min={new Date().toISOString().split('T')[0]} // Prevent past dates
      />
      <Calendar className="size-5 flex-shrink-0 transition-all duration-200 sm:size-4 pointer-events-none" />
    </div>
  );
});
