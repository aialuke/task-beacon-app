
import UserSearchInput from "@/components/UserSearchInput";

interface UserSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function UserSearchField({ value, onChange, disabled = false }: UserSearchFieldProps) {
  return (
    <div>
      <UserSearchInput
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder="Assign Task"
      />
    </div>
  );
}
