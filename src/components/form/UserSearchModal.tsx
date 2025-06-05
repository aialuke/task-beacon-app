
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { AutocompleteUserInput } from './AutocompleteUserInput';

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
        <div className="py-4">
          <AutocompleteUserInput 
            value={value} 
            onChange={handleUserSelect}
            placeholder="Search for a user to assign..."
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
