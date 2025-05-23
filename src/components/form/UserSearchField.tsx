
import UserSearchInput from "@/components/UserSearchInput";

interface UserSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function UserSearchField({ value, onChange, disabled = false }: UserSearchFieldProps) {
  return (
    <div className="space-y-2">
      <UserSearchInput
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder="Assign Task"
      />
    </div>
  );
}
