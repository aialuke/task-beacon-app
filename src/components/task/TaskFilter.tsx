
import { memo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "@/lib/types";
import { useUIContext } from "@/contexts/UIContext";

interface TaskFilterProps {
  filter: TaskStatus | "all";
  onFilterChange: (value: TaskStatus | "all") => void;
}

function TaskFilter({ filter, onFilterChange }: TaskFilterProps) {
  const { isMobile } = useUIContext();
  
  return (
    <div className={`${isMobile ? 'w-[40%]' : 'w-1/4'} flex justify-start`}>
      <Select
        value={filter}
        onValueChange={(value) => onFilterChange(value as TaskStatus | "all")}
      >
        <SelectTrigger className="filter-dropdown-mobile rounded-xl w-full">
          <SelectValue placeholder="Filter tasks" />
        </SelectTrigger>
        <SelectContent className="bg-white rounded-xl">
          <SelectItem value="all" className="text-foreground">Current Tasks</SelectItem>
          <SelectItem value="pending" className="text-foreground">Pending</SelectItem>
          <SelectItem value="overdue" className="text-destructive">
            Overdue
          </SelectItem>
          <SelectItem value="complete" className="text-success">
            Complete
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default memo(TaskFilter);
