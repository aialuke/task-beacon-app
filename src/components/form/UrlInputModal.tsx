import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FloatingInput } from "@/components/form/FloatingInput";
import { FormActions } from "@/components/form/FormActions";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface UrlInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (url: string) => void; // Make onSubmit optional
  value: string;
  onChange: (value: string) => void;
}

export function UrlInputModal({ isOpen, onClose, onSubmit, value, onChange }: UrlInputModalProps) {
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) {
      setError("URL is required");
      return;
    }
    try {
      new URL(value);
      onSubmit(value);
      onClose();
    } catch {
      setError("Please enter a valid URL");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <VisuallyHidden asChild>
            <DialogTitle>Add URL</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        
        <div className="space-y-4 pb-4">
          <FloatingInput
            id="url-input"
            label="URL"
            value={value}
            onChange={handleInputChange}
            error={error ?? undefined}
          />
        </div>

        <FormActions
          onSubmit={handleSubmit}
          onCancel={() => {
            onChange(""); // Clear the URL on cancel
            onClose();
          }}
          submitLabel="Add"
        />
      </DialogContent>
    </Dialog>
  );
}