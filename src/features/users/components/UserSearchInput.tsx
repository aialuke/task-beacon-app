import { EnhancedUserSearch } from '@/features/users/components/EnhancedUserSearch';

interface UserSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function UserSearchInput({
  value,
  onChange,
  disabled = false,
  placeholder = 'Assign task',
  className,
  onFocus,
  onBlur,
}: UserSearchInputProps) {
  return (
    <div onFocus={onFocus} onBlur={onBlur}>
      <EnhancedUserSearch
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
} 