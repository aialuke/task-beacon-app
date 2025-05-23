
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import { Pin } from "lucide-react";
import { useUIContext } from "@/contexts/UIContext";
import TaskStatus from "./TaskStatus";
import TaskExpandButton from "./TaskExpandButton";

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
  return (
    <div className="flex items-center w-full gap-3 task-header-container">
      <TaskStatus task={task} />

      <div className="flex-1 min-w-0 flex items-center">
        <h3 
          className="text-base sm:text-lg font-semibold text-gray-800 mb-0" 
          title={task.title}
        >
          {task.title}
        </h3>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 h-8 w-8 ml-1 no-shadow hover:bg-gray-100"
        onClick={handleTogglePin}
        title={task.pinned ? "Unpin task" : "Pin task"}
      >
        {task.pinned ? (
          <Pin size={16} className="text-primary stroke-primary icon-filled" />
        ) : (
          <Pin size={16} className="text-gray-600 stroke-gray-600" style={{ opacity: 0.8 }} />
        )}
      </Button>

      <TaskExpandButton isExpanded={isExpanded} onClick={toggleExpand} />
    </div>
  );
}

export default memo(TaskHeader);
