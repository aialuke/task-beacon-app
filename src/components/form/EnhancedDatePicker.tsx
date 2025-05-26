
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";

interface EnhancedDatePickerProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EnhancedDatePicker({ value, onChange }: EnhancedDatePickerProps) {
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
        target: { value: localDateTime }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative group">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "w-full h-14 pt-6 pb-2 px-4 justify-start text-left font-normal bg-background/60 backdrop-blur-sm border-border/40 rounded-2xl transition-all duration-300 hover:bg-background/70 hover:border-border/60 focus:bg-background/80 focus:border-primary/60 focus:shadow-lg focus:shadow-primary/10",
              !selectedDate && "text-muted-foreground/70"
            )}
          >
            <CalendarIcon className={cn(
              "h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300",
              isFloating ? "text-primary scale-95" : "text-muted-foreground"
            )} />
            
            <div className="pl-7 w-full">
              <div className={cn(
                "absolute left-11 transition-all duration-300 pointer-events-none select-none font-medium",
                isFloating
                  ? "top-2 text-xs text-primary"
                  : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
              )}>
                Due Date
              </div>
              
              {selectedDate && (
                <div className="pt-2 text-sm text-foreground font-medium">
                  {format(selectedDate, "MMM d, yyyy")}
                </div>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-background/95 backdrop-blur-lg border-border/60 shadow-2xl" 
          align="start"
          sideOffset={8}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date()}
            initialFocus
            className={cn("p-4 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>

      {/* Enhanced focus ring */}
      <div className={cn(
        "absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none",
        (isFocused || isOpen) && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
      )} />
    </div>
  );
}
