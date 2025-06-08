
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
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
    // Don't auto-close here - let the component handle the two-step process
  };

  const handleSubmit = () => {
    // Only close modal when user actually submits (second Enter press)
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 sm:max-w-md">
        <VisuallyHidden>
          <DialogTitle>Search Users</DialogTitle>
        </VisuallyHidden>
        <div className="py-4">
          <AutocompleteUserInput 
            value={value} 
            onChange={handleUserSelect}
            onSubmit={handleSubmit}
            placeholder="Search for a user to assign..."
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
// CodeRabbit review
