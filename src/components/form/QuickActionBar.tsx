
import { Calendar, User, ImageUp, Link, FileCheck, Send } from "lucide-react";
import { useState, useRef } from "react";
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
  
  const selectedDate = dueDate ? new Date(dueDate) : undefined;
  const hasUrl = !!url;
  const hasPhoto = !!photoPreview;
  const hasAssignee = !!assigneeId;
  const hasDate = !!selectedDate;

  const handleDateSelect = (date: Date | undefined) => {
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
    <div className="flex flex-wrap gap-2 px-4 py-2 bg-background/30 backdrop-blur-sm rounded-xl justify-center">
      {/* Date Picker Button */}
      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={hasDate ? "brand" : "outline"}
            size="sm"
            disabled={disabled}
            className="min-h-[44px] min-w-[44px] gap-2"
          >
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm font-medium hidden sm:inline whitespace-nowrap">
              {hasDate ? format(selectedDate!, "MMM d") : "Due Date"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0" 
          align="start"
          sideOffset={8}
        >
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date()}
            initialFocus
            className="p-4"
          />
        </PopoverContent>
      </Popover>

      {/* Assignee Button */}
      <Button
        variant={hasAssignee ? "brand" : "outline"}
        size="sm"
        onClick={() => setIsUserModalOpen(true)}
        disabled={disabled}
        className="min-h-[44px] min-w-[44px] gap-2"
      >
        <User className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm font-medium hidden sm:inline whitespace-nowrap">
          {hasAssignee ? "Assigned" : "Assign"}
        </span>
      </Button>

      {/* Photo Button */}
      <Button
        variant={hasPhoto ? "brand" : "outline"}
        size="sm"
        onClick={handlePhotoClick}
        disabled={disabled}
        className="min-h-[44px] min-w-[44px] gap-2"
      >
        <ImageUp className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm font-medium hidden sm:inline whitespace-nowrap">
          {hasPhoto ? "Photo Added" : "Attach"}
        </span>
      </Button>

      {/* URL Button */}
      <Button
        variant={hasUrl ? "brand" : "outline"}
        size="sm"
        onClick={() => setIsUrlModalOpen(true)}
        disabled={disabled}
        className="min-h-[44px] min-w-[44px] gap-2"
      >
        {hasUrl ? (
          <FileCheck className="h-4 w-4 flex-shrink-0" />
        ) : (
          <Link className="h-4 w-4 flex-shrink-0" />
        )}
        <span className="text-sm font-medium hidden sm:inline whitespace-nowrap">
          {hasUrl ? "Link Added" : "Link"}
        </span>
      </Button>

      {/* Submit Button */}
      {onSubmit && (
        <Button
          variant="brand"
          size="icon"
          onClick={handleSubmit}
          disabled={disabled || isSubmitting}
          className="w-[44px] h-[44px]"
          title={isSubmitting ? "Creating..." : submitLabel}
        >
          {isSubmitting ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <Send className="h-4 w-4" />
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
