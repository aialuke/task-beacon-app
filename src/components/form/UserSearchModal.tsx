
import { useState } from "react";
import { User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EnhancedUserSearch } from "@/components/form/EnhancedUserSearch";
import { Button } from "@/components/ui/button";

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
}

export function UserSearchModal({ isOpen, onClose, value, onChange }: UserSearchModalProps) {
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
            <User className="h-5 w-5" />
            Assign Task
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <EnhancedUserSearch
            value={tempValue}
            onChange={setTempValue}
          />
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Assign Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
