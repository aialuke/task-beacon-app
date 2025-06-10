import { memo } from "react";
import {
  ClockFading,
  ClockAlert,
  CircleCheckBig,
  Users,
  LucideIcon,
} from "lucide-react";
import { SimpleNavbar } from "@/components/ui/simple-navbar";
import type { TaskFilter } from "@/types";

interface TaskFilterNavbarProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

interface FilterItem {
  name: string;
  value: TaskFilter;
  icon: LucideIcon;
}

function TaskFilterNavbarComponent({
  filter,
  onFilterChange,
}: TaskFilterNavbarProps) {
  const filters: FilterItem[] = [
    { name: "Current", value: "all", icon: ClockFading },
    { name: "Overdue", value: "overdue", icon: ClockAlert },
    { name: "Assigned", value: "assigned", icon: Users },
    { name: "Complete", value: "complete", icon: CircleCheckBig },
  ];

  // Convert to SimpleNavbar format
  const navItems = filters.map((f) => ({
    name: f.name,
    value: f.value as string,
    icon: f.icon,
  }));

  const handleItemChange = (value: string) => {
    onFilterChange(value as TaskFilter);
  };

  return (
    <SimpleNavbar
      items={navItems}
      activeItem={filter as string}
      onItemChange={handleItemChange}
      className="w-full pb-1"
    />
  );
}

export default memo(TaskFilterNavbarComponent);
