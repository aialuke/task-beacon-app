
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import { getStatusColor, getTaskStatus } from "@/lib/utils";
import CountdownTimer from "../CountdownTimer";
import { Pin } from "lucide-react";
import { useUIContext } from "@/contexts/UIContext";

interface TaskHeaderProps {
  task: Task;
  isExpanded: boolean;
  toggleExpand: () => void;
  handleTogglePin: () => void;
}

function TaskHeader({
  task,
  isExpanded,
  toggleExpand,
  handleTogglePin,
}: TaskHeaderProps) {
  const { isMobile } = useUIContext();
  const status = getTaskStatus(task);

  return (
    <div className="flex items-center w-full gap-2 task-header-container">
      <div className="shrink-0">
        <CountdownTimer dueDate={task.due_date} status={status} />
      </div>

      <div className="flex-1 min-w-0 flex items-center">
        <h3 className="text-base sm:text-lg text-gray-900 mb-0" title={task.title}>
          {task.title}
        </h3>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 h-8 w-8 ml-1 no-shadow"
        onClick={handleTogglePin}
        title={task.pinned ? "Unpin task" : "Pin task"}
      >
        {task.pinned ? (
          <Pin size={16} className="text-gray-900 stroke-gray-900 icon-filled" />
        ) : (
          <Pin size={16} className="text-gray-900 stroke-gray-900" style={{ opacity: 0.8 }} />
        )}
      </Button>

      <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 no-shadow" onClick={toggleExpand}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className={`transform transition-transform text-gray-900 stroke-gray-900 ${isExpanded ? "rotate-180" : ""}`}
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </div>
  );
}

export default memo(TaskHeader);
