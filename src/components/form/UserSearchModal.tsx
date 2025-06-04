
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EnhancedUserSearch } from '@/components/form/EnhancedUserSearch';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
      <DialogContent className="pb-8 pt-4 sm:max-w-md h-[40vh] sm:h[50vh]">
        <div className="space-y-4 pb-4">
          <EnhancedUserSearch value={value} onChange={handleUserSelect} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
