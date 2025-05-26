
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";

interface DatePickerFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DatePickerField({ value, onChange }: DatePickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Convert string value to Date object for the calendar
  const selectedDate = value ? new Date(value) : undefined;
  
  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Convert Date back to datetime-local string format
      const isoString = date.toISOString();
      const localDateTime = isoString.slice(0, 16); // YYYY-MM-DDTHH:mm format
      
      // Create a synthetic event to maintain compatibility with existing forms
      const syntheticEvent = {
        target: { value: localDateTime }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-12 px-4 justify-start text-left font-normal bg-background/70 border-border/60 rounded-xl hover:bg-accent/50 transition-all duration-200",
              !selectedDate && "text-muted-foreground/70"
            )}
          >
            <CalendarIcon className="h-5 w-5 mr-3 text-muted-foreground" />
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>Due Date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date()}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
