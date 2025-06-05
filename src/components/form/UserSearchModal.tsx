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
      <DialogContent className="fixed top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-md h-auto max-h-[40vh]">
        <div className="flex flex-col space-y-2">
          <EnhancedUserSearch 
            value={value} 
            onChange={handleUserSelect}
            className="flex-grow"
            dropdownClassName="absolute z-[9999] mt-2 w-full overflow-visible rounded-xl border border-border bg-popover shadow-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
