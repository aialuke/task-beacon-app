import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { EnhancedUserSearch } from '@/components/form/EnhancedUserSearch';

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
      <DialogContent className="pb-8 pt-12 sm:max-w-md h-[40vh] sm:h[50vh]">
        <div className="space-y-4 pb-4">
          <EnhancedUserSearch value={value} onChange={handleUserSelect} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
