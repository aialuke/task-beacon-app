
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Task } from "@/types";
import { Pin } from "lucide-react";
import { useTaskUIContext } from "@/features/tasks/context/TaskUIContext";
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
    <div className="flex items-center w-full gap-2 task-header-container">
      <TaskStatus task={task} />

      <div className="flex-1 min-w-0 flex items-center">
        <h3 className="text-base sm:text-lg text-card-foreground mb-0" title={task.title}>
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
          <Pin size={16} className="text-card-foreground fill-current" />
        ) : (
          <Pin size={16} className="text-card-foreground opacity-80" />
        )}
      </Button>

      <TaskExpandButton isExpanded={isExpanded} onClick={toggleExpand} />
    </div>
  );
}

export default memo(TaskHeader);
