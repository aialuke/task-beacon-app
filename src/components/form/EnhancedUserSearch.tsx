
import { EnhancedUserSearch as BaseEnhancedUserSearch } from '@/features/users/components/EnhancedUserSearch';

interface EnhancedUserSearchProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function EnhancedUserSearch({
  value,
  onChange,
  disabled = false,
}: EnhancedUserSearchProps) {
  return (
    <BaseEnhancedUserSearch
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder="Assign to"
    />
  );
}
