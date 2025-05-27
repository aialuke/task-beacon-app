import { Calendar, User, ImageUp, Link, FileCheck, Send } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { UrlInputModal } from "./UrlInputModal";
import { UserSearchModal } from "./UserSearchModal";

interface QuickActionBarProps {
  // Date picker props
  dueDate: string;
  onDueDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  // User assignment props
  assigneeId: string;
  onAssigneeChange: (value: string) => void;
  
  // Photo upload props
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  photoPreview: string | null;
  
  // URL props
  url: string;
  onUrlChange: (value: string) => void;
  
  // Submit props
  onSubmit?: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  
  disabled?: boolean;
}

export function QuickActionBar({ 
  dueDate,
  onDueDateChange,
  assigneeId,
  onAssigneeChange,
  onPhotoChange,
  photoPreview,
  url,
  onUrlChange,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Share Task",
  disabled = false 
}: QuickActionBarProps) {
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const selectedDate: Date | undefined = dueDate ? new Date(dueDate) : undefined;
  const hasUrl = !!url;
  const hasPhoto = !!photoPreview;
  const hasAssignee = !!assigneeId;
  const hasDate = !!selectedDate;

  const handleDateSelect = (date: Date | undefined): void => {
    if (date) {
      const isoString = date.toISOString();
      const localDateTime = isoString.slice(0, 16);
      
      const syntheticEvent = {
        target: { value: localDateTime }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onDueDateChange(syntheticEvent);
    }
    setIsDatePickerOpen(false);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <div className="flex items-center justify-center gap-4 px-4 py-1.5 bg-background/30 backdrop-blur-sm rounded-xl">
      {/* Action buttons container */}
      <div className="flex items-center gap-3">
        {/* Date Picker Button */}
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={disabled}
              className={cn(
                "w-[48px] h-[48px] rounded-full flex items-center justify-center",
                "aspect-square [aspect-ratio:1/1]",
                "hover:scale-105 active:scale-95 transition-all duration-200",
                hasDate 
                  ? "bg-primary/20 text-primary border border-primary/30 shadow-md shadow-primary/10" 
                  : "bg-background/60 text-muted-foreground border border-border/40 hover:bg-background/80 hover:text-foreground"
              )}
            >
              <Calendar className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0 bg-popover text-popover-foreground border-border shadow-lg" 
            align="start"
            sideOffset={8}
          >
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date: Date) => date < new Date()}
              initialFocus
              className="p-4 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Assignee Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsUserModalOpen(true)}
          disabled={disabled}
          className={cn(
            "w-[48px] h-[48px] rounded-full flex items-center justify-center",
            "aspect-square [aspect-ratio:1/1]",
            "hover:scale-105 active:scale-95 transition-all duration-200",
            hasAssignee 
              ? "bg-primary/20 text-primary border border-primary/30 shadow-md shadow-primary/10" 
              : "bg-background/60 text-muted-foreground border border-border/40 hover:bg-background/80 hover:text-foreground"
          )}
        >
          <User className="h-5 w-5" />
        </Button>

        {/* Photo Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePhotoClick}
          disabled={disabled}
          className={cn(
            "w-[48px] h-[48px] rounded-full flex items-center justify-center",
            "aspect-square [aspect-ratio:1/1]",
            "hover:scale-105 active:scale-95 transition-all duration-200",
            hasPhoto 
              ? "bg-primary/20 text-primary border border-primary/30 shadow-md shadow-primary/10" 
              : "bg-background/60 text-muted-foreground border border-border/40 hover:bg-background/80 hover:text-foreground"
          )}
        >
          <ImageUp className="h-5 w-5" />
        </Button>

        {/* URL Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsUrlModalOpen(true)}
          disabled={disabled}
          className={cn(
            "w-[48px] h-[48px] rounded-full flex items-center justify-center",
            "aspect-square [aspect-ratio:1/1]",
            "hover:scale-105 active:scale-95 transition-all duration-200",
            hasUrl 
              ? "bg-primary/20 text-primary border border-primary/30 shadow-md shadow-primary/10" 
              : "bg-background/60 text-muted-foreground border border-border/40 hover:bg-background/80 hover:text-foreground"
          )}
        >
          {hasUrl ? (
            <FileCheck className="h-5 w-5" />
          ) : (
            <Link className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Submit Button */}
      {onSubmit && (
        <Button
          onClick={handleSubmit}
          disabled={disabled || isSubmitting}
          size="icon"
          className={cn(
            "w-[48px] h-[48px] rounded-full flex items-center justify-center",
            "aspect-square [aspect-ratio:1/1]",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "hover:scale-105 active:scale-95 transition-all duration-200",
            "shadow-md hover:shadow-lg"
          )}
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onPhotoChange}
        className="sr-only"
        aria-label="Upload Image"
      />

      {/* Modals */}
      <UrlInputModal
        isOpen={isUrlModalOpen}
        onClose={() => setIsUrlModalOpen(false)}
        value={url}
        onChange={onUrlChange}
      />

      <UserSearchModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        value={assigneeId}
        onChange={onAssigneeChange}
      />
    </div>
  );
}