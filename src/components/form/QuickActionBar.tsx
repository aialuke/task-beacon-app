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

  const getButtonContent = (type: 'date' | 'assignee' | 'photo' | 'url' | 'submit') => {
    switch (type) {
      case 'date':
        return {
          icon: Calendar,
          label: hasDate ? format(selectedDate!, "MMM d") : "Due Date",
          active: hasDate
        };
      case 'assignee':
        return {
          icon: User,
          label: hasAssignee ? "Assigned" : "Assign",
          active: hasAssignee
        };
      case 'photo':
        return {
          icon: ImageUp,
          label: hasPhoto ? "Photo Added" : "Attach",
          active: hasPhoto
        };
      case 'url':
        return {
          icon: hasUrl ? FileCheck : Link,
          label: hasUrl ? "Link Added" : "Link",
          active: hasUrl
        };
      case 'submit':
        return {
          icon: Send,
          label: submitLabel,
          active: false
        };
      default:
        return { icon: Calendar, label: "", active: false };
    }
  };

  const buttonBaseClasses = cn(
    "flex items-center justify-center gap-2 transition-all duration-200 touch-manipulation",
    "hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
    // Mobile: fixed size for icon-only, Desktop: min-width to accommodate label
    "w-[48px] h-[48px] sm:min-w-[48px] sm:h-[48px] sm:px-4 sm:py-2",
    "rounded-full aspect-square [aspect-ratio:1/1]",
    disabled && "opacity-50 cursor-not-allowed hover:scale-100"
  );

  const getButtonClasses = (active: boolean, isSubmit?: boolean) => cn(
    buttonBaseClasses,
    isSubmit
      ? "bg-primary text-primary-foreground border border-primary shadow-md hover:bg-primary/90"
      : active
        ? "bg-primary/20 text-primary border border-primary/30 shadow-md shadow-primary/10"
        : "bg-background/60 text-muted-foreground border border-border/40 hover:bg-background/80 hover:text-foreground hover:border-border/60"
  );

  return (
    <div className="flex items-center justify-center gap-4 px-4 py-1.5 bg-background/30 backdrop-blur-sm rounded-xl">
      {/* Action buttons container */}
      <div className="flex items-center gap-3">
        {/* Date Picker Button */}
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              disabled={disabled}
              className={getButtonClasses(hasDate)}
            >
              <Calendar className={cn(
                "h-5 w-5 sm:h-4 sm:w-4 transition-all duration-200 flex-shrink-0",
                hasDate && "scale-110"
              )} />
              <span className="text-sm font-medium hidden sm:inline whitespace-nowrap">
                {getButtonContent('date').label}
              </span>
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
          onClick={() => setIsUserModalOpen(true)}
          disabled={disabled}
          className={getButtonClasses(hasAssignee)}
        >
          <User className={cn(
            "h-5 w-5 sm:h-4 sm:w-4 transition-all duration-200 flex-shrink-0",
            hasAssignee && "scale-110"
          )} />
          <span className="text-sm font-medium hidden sm:inline whitespace-nowrap">
            {getButtonContent('assignee').label}
          </span>
        </Button>

        {/* Photo Button */}
        <Button
          variant="ghost"
          onClick={handlePhotoClick}
          disabled={disabled}
          className={getButtonClasses(hasPhoto)}
        >
          <ImageUp className={cn(
            "h-5 w-5 sm:h-4 sm:w-4 transition-all duration-200 flex-shrink-0",
            hasPhoto && "scale-110"
          )} />
          <span className="text-sm font-medium hidden sm:inline whitespace-nowrap">
            {getButtonContent('photo').label}
          </span>
        </Button>

        {/* URL Button */}
        <Button
          variant="ghost"
          onClick={() => setIsUrlModalOpen(true)}
          disabled={disabled}
          className={getButtonClasses(hasUrl)}
        >
          {hasUrl ? (
            <FileCheck className="h-5 w-5 sm:h-4 sm:w-4 transition-all duration-200 flex-shrink-0 scale-110" />
          ) : (
            <Link className="h-5 w-5 sm:h-4 sm:w-4 transition-all duration-200 flex-shrink-0" />
          )}
          <span className="text-sm font-medium hidden sm:inline whitespace-nowrap">
            {getButtonContent('url').label}
          </span>
        </Button>
      </div>

      {/* Submit Button */}
      {onSubmit && (
        <Button
          onClick={handleSubmit}
          disabled={disabled || isSubmitting}
          size="icon"
          className={getButtonClasses(false, true)}
        >
          {isSubmitting ? (
            <div className="h-5 w-5 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <Send className="h-5 w-5 sm:h-4 sm:w-4 transition-all duration-200 flex-shrink-0" />
          )}
          <span className="text-sm font-medium hidden sm:inline whitespace-nowrap">
            {getButtonContent('submit').label}
          </span>
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