import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

import { AutocompleteUserInput } from './AutocompleteUserInput';

interface UserSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
}

/**
 * User Search Modal - Phase 2.2 Simplified
 *
 * Delegates all user state management to AutocompleteUserInput.
 * No local state duplication.
 */
export function UserSearchModal({
  isOpen,
  onClose,
  value,
  onChange,
}: UserSearchModalProps) {
  const handleUserSelect = (selectedValue: string) => {
    onChange(selectedValue);
  };

  const handleSubmit = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 sm:max-w-md">
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
