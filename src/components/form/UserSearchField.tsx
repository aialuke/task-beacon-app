
import { User } from "lucide-react";
import { Label } from "@/components/ui/label";
import UserSelect from "@/components/UserSelect";

interface UserSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function UserSearchField({ value, onChange, disabled = false }: UserSearchFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="assignee" className="text-foreground flex items-center gap-2">
        <User className="h-4 w-4" />
        <span>Assignee</span>
      </Label>
      <UserSelect
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
