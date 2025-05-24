
import { memo } from "react";
import { ClockFading, ClockAlert, CircleCheckBig, Users } from "lucide-react";
import { SimpleNavbar } from "@/components/ui/simple-navbar";
import { TaskFilter } from "@/features/tasks/types";

interface TaskFilterNavbarProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

function TaskFilterNavbarComponent({ filter, onFilterChange }: TaskFilterNavbarProps) {
  const filters = [
    { name: "Current", value: "all" as TaskFilter, icon: ClockFading },
    { name: "Overdue", value: "overdue" as TaskFilter, icon: ClockAlert },
    { name: "Assigned", value: "assigned" as TaskFilter, icon: Users },
    { name: "Complete", value: "complete" as TaskFilter, icon: CircleCheckBig }
  ];

  return (
    <SimpleNavbar 
      items={filters}
      activeItem={filter}
      onItemChange={onFilterChange}
      className="pb-1 w-full"
    />
  );
}

export default memo(TaskFilterNavbarComponent);
