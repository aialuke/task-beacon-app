import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { EnhancedUserSearch } from '@/features/users/components/EnhancedUserSearch';

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
}

export function UserSearchModal({
  isOpen,
  onClose,
  value,
  onChange,
}: UserSearchModalProps) {
  const handleUserSelect = (selectedValue: string) => {
    onChange(selectedValue);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-md">
        <div className="max-h-[40vh] overflow-visible">
          <EnhancedUserSearch 
            value={value} 
            onChange={handleUserSelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
