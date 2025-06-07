
import { useState, useRef } from 'react';
import { Link, ArrowRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface UrlInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
}

export function UrlInputModal({
  isOpen,
  onClose,
  value,
  onChange,
}: UrlInputModalProps) {
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Enhanced URL validation that accepts domains without protocol
  const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    
    // Check if it already has a protocol
    if (/^https?:\/\//.test(url)) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }
    
    // Check for domain pattern without protocol (e.g., google.com, www.google.com)
    const domainPattern = /^(www\.)?[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
    return domainPattern.test(url);
  };

  const isValid = isValidUrl(tempValue);

  const handleSubmit = () => {
    if (isValid) {
      let finalUrl = tempValue;
      
      // Add https:// prefix if URL doesn't have a protocol
      if (!/^https?:\/\//.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }
      
      onChange(finalUrl);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setTempValue(value);
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempValue(e.target.value);
  };

  const getTextColor = () => {
    return isValid ? 'text-blue-500' : 'text-foreground';
  };

  const getIconColor = () => {
    return isValid ? 'text-blue-500' : 'text-muted-foreground';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-md">
        <VisuallyHidden>
          <DialogTitle>Enter URL</DialogTitle>
        </VisuallyHidden>
        <div className="space-y-4">
          <div className="relative flex h-12 items-center p-2 rounded-2xl border border-border bg-background/60 backdrop-blur-sm hover:bg-background/70">
            <Link className={cn('h-4 w-4 ml-1', getIconColor())} />

            <div className="flex-1 min-w-0 ml-3 flex items-center">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Enter URL"
                value={tempValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className={cn(
                  "h-auto border-none bg-transparent pl-1 pr-0 text-sm font-semibold focus:ring-0 focus-visible:ring-0",
                  getTextColor()
                )}
                autoFocus
              />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-2 h-8 w-8 p-0 transition-colors"
              onClick={handleSubmit}
              disabled={!isValid}
            >
              <ArrowRight 
                className={cn(
                  "h-4 w-4 transition-colors",
                  isValid ? "text-blue-500" : "text-muted-foreground"
                )} 
              />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
