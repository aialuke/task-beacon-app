import { useState } from 'react';
import { Link } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { FloatingInput } from '@/components/ui/form/FloatingInput';
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
  const [error, setError] = useState<string | null>(null);

  const validateUrl = (url: string): boolean => {
    // Simple URL validation regex
    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/i;
    return urlPattern.test(url);
  };

  const handleSave = () => {
    if (!tempValue) {
      // Allow empty URL (optional field)
      onChange(tempValue);
      onClose();
      return;
    }

    if (!validateUrl(tempValue)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setError(null);
    onChange(tempValue);
    onClose();
  };

  const handleCancel = () => {
    setTempValue(value);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-md">
        <div className="space-y-4">
          <div>
            <FloatingInput
              id="url-input"
              type="text"
              value={tempValue}
              onChange={(e) => {
                setTempValue(e.target.value);
                setError(null); // Clear error on input change
              }}
              label="URL"
              icon={<Link className="h-4 w-4" />}
              autoFocus
              className="[&_input]:h-12"
            />
            {error && (
              <p
                className={cn(
                  'mt-1 text-sm text-destructive',
                  'animate-in fade-in-0'
                )}
              >
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save URL</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
