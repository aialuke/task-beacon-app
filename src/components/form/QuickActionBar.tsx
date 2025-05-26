
import { Calendar, User, ImageUp, Link, FileCheck } from "lucide-react";
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

  const getButtonContent = (type: 'date' | 'assignee' | 'photo' | 'url') => {
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
      default:
        return { icon: Calendar, label: "", active: false };
    }
  };

  const buttonBaseClasses = cn(
    "flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all duration-300 min-h-[44px] min-w-[44px] touch-manipulation",
    "hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
    disabled && "opacity-50 cursor-not-allowed hover:scale-100"
  );

  const getButtonClasses = (active: boolean) => cn(
    buttonBaseClasses,
    active
      ? "bg-primary/20 text-primary border border-primary/30 shadow-md shadow-primary/10"
      : "bg-background/60 text-muted-foreground border border-border/40 hover:bg-background/80 hover:text-foreground hover:border-border/60"
  );

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-background/30 backdrop-blur-sm rounded-xl">
      {/* Date Picker Button */}
      <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            disabled={disabled}
            className={getButtonClasses(hasDate)}
          >
            <Calendar className={cn(
              "h-4 w-4 transition-all duration-200 flex-shrink-0",
              hasDate && "scale-110"
            )} />
            <span className="text-sm font-medium hidden sm:inline whitespace-nowrap">
              {getButtonContent('date').label}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 bg-background/95 backdrop-blur-lg border-border/60 shadow-2xl" 
          align="start"
          sideOffset={8}
        >
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date()}
            initialFocus
            className="p-4 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {/* Assignee Button */}
      <button
        type="button"
        onClick={() => setIsUserModalOpen(true)}
        disabled={disabled}
        className={getButtonClasses(hasAssignee)}
      >
        <User className={cn(
          "h-4 w-4 transition-all duration-200 flex-shrink-0",
          hasAssignee && "scale-110"
        )} />
        <span className="text-sm font-medium hidden sm:inline whitespace-nowrap">
          {getButtonContent('assignee').label}
        </span>
      </button>

      {/* Photo Button */}
      <button
        type="button"
        onClick={handlePhotoClick}
        disabled={disabled}
        className={getButtonClasses(hasPhoto)}
      >
        <ImageUp className={cn(
          "h-4 w-4 transition-all duration-200 flex-shrink-0",
          hasPhoto && "scale-110"
        )} />
        <span className="text-sm font-medium hidden sm:inline whitespace-nowrap">
          {getButtonContent('photo').label}
        </span>
      </button>

      {/* URL Button */}
      <button
        type="button"
        onClick={() => setIsUrlModalOpen(true)}
        disabled={disabled}
        className={getButtonClasses(hasUrl)}
      >
        {hasUrl ? (
          <FileCheck className="h-4 w-4 transition-all duration-200 flex-shrink-0 scale-110" />
        ) : (
          <Link className="h-4 w-4 transition-all duration-200 flex-shrink-0" />
        )}
        <span className="text-sm font-medium hidden sm:inline whitespace-nowrap">
          {getButtonContent('url').label}
        </span>
      </button>

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
