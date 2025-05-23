
// Moving from src/components/task/TaskFilter.tsx
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { TaskFilter } from "@/features/tasks/types";

interface TaskFilterProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

function TaskFilterComponent({ filter, onFilterChange }: TaskFilterProps) {
  const filters: { value: TaskFilter; label: string }[] = [
    { value: "all", label: "Current" },
    { value: "complete", label: "Complete" },
    { value: "overdue", label: "Overdue" },
    { value: "assigned", label: "Assigned" }
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full">
      {filters.map((f) => (
        <Button
          key={f.value}
          variant={filter === f.value ? "default" : "outline"}
          size="sm"
          className="text-xs rounded-full whitespace-nowrap"
          onClick={() => onFilterChange(f.value)}
        >
          {f.label}
        </Button>
      ))}
    </div>
  );
}

export default memo(TaskFilterComponent);
