
import { useState } from "react";
import { Link } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FloatingInput } from "@/components/form/FloatingInput";
import { Button } from "@/components/ui/button";

interface UrlInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
}

export function UrlInputModal({ isOpen, onClose, value, onChange }: UrlInputModalProps) {
  const [tempValue, setTempValue] = useState(value);

  const handleSave = () => {
    onChange(tempValue);
    onClose();
  };

  const handleCancel = () => {
    setTempValue(value);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Add Reference URL
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <FloatingInput
            id="url-input"
            type="url"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder="https://example.com"
            label="URL"
            icon={<Link className="h-4 w-4" />}
            autoFocus
          />
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save URL
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
