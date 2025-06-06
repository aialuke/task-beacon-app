import { memo } from "react";
import type { Task } from "@/types";
import TaskStatus from "./TaskStatus";
import TaskExpandButton from "./TaskExpandButton";

interface TaskHeaderProps {
  task: Task;
  isExpanded: boolean;
  toggleExpand: () => void;
}

function TaskHeader({ task, isExpanded, toggleExpand }: TaskHeaderProps) {
  return (
    <div className="flex w-full items-center gap-2">
      <TaskStatus task={task} />
      <div className="flex min-w-0 flex-1 items-center">
        <h3
          className="mb-0 text-base text-card-foreground sm:text-lg"
          title={task.title}
        >
          {task.title}
        </h3>
      </div>
      <TaskExpandButton isExpanded={isExpanded} onClick={toggleExpand} />
    </div>
  );
}

export default memo(TaskHeader);
