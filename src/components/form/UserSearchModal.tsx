
import { useState } from "react";
import { User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EnhancedUserSearch } from "@/components/form/EnhancedUserSearch";

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
}

export function UserSearchModal({ isOpen, onClose, value, onChange }: UserSearchModalProps) {
  const [tempValue, setTempValue] = useState(value);

  const handleUserSelect = (selectedValue: string) => {
    onChange(selectedValue);
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
            onChange={handleUserSelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
