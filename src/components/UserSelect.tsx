
import { EnhancedUserSearch } from '@/features/users/components/EnhancedUserSearch';

interface UserSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function UserSelect({
  value,
  onChange,
  disabled = false,
}: UserSelectProps) {
  return (
    <EnhancedUserSearch
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder="Select assignee"
    />
  );
}
