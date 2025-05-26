
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
  
  const selectedDate = value ? new Date(value) : undefined;
  
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
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-8 px-3 justify-start text-left font-normal bg-background/80 border-border/60 rounded-xl hover:bg-accent/50 transition-all duration-200 text-sm",
              !selectedDate && "text-muted-foreground/70"
            )}
          >
            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            {selectedDate ? (
              format(selectedDate, "MMM d, yyyy")
            ) : (
              <span>Due Date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          align="start"
          style={{ 
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))"
          }}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date()}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
            style={{ 
              backgroundColor: "hsl(var(--popover))",
              color: "hsl(var(--popover-foreground))"
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
