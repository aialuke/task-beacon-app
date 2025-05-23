
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

interface DatePickerFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DatePickerField({ value, onChange }: DatePickerFieldProps) {
  return (
    <div className="relative">
      <div className="relative">
        <Input
          id="due_date"
          type="datetime-local"
          value={value}
          onChange={onChange}
          placeholder="Select due date"
          required
          className="pl-9 transition-all"
        />
        <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  );
}
