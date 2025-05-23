
import { memo } from "react";
import { Task } from "@/lib/types";
import { getTaskStatus } from "@/lib/uiUtils";
import CountdownTimer from "@/components/CountdownTimer";

interface TaskStatusProps {
  task: Task;
}

function TaskStatus({ task }: TaskStatusProps) {
  const status = getTaskStatus(task);

  return (
    <div className="shrink-0">
      <CountdownTimer dueDate={task.due_date} status={status} />
    </div>
  );
}

export default memo(TaskStatus);
