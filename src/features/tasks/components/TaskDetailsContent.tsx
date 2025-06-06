import { memo } from "react";
import { Task } from "@/types";
import { useTaskUIContext } from "@/features/tasks/context/TaskUIContext";
import TaskActions from "./TaskActions";
import TaskMetadata from "./TaskMetadata";
import ParentTaskInfo from "./ParentTaskInfo";
import { TaskImageGallery } from "./TaskImageGallery";

interface TaskDetailsContentProps {
  task: Task;
}

function TaskDetailsContent({ task }: TaskDetailsContentProps) {
  const { isMobile } = useTaskUIContext();

  // Check if photo should be rendered - handle both null and string values properly
  const shouldRenderPhoto =
    task.photo_url &&
    typeof task.photo_url === "string" &&
    task.photo_url.trim() !== "";

  return (
    <div
      className={`space-y-3 ${isMobile ? "pb-4 pl-4 pt-2" : "pb-4 pl-6 pt-2"}`}
      style={{ height: "auto", overflowY: "hidden" }}
    >
      {task.description && (
        <div className="text-sm text-muted-foreground">{task.description}</div>
      )}

      <TaskMetadata dueDate={task.due_date} url={task.url_link} />

      {task.parent_task && task.parent_task_id && (
        <ParentTaskInfo
          parentTask={{
            ...task.parent_task,
            status: "pending", // Default status since parent_task doesn't include status
          }}
          parentTaskId={task.parent_task_id}
        />
      )}

      {shouldRenderPhoto && <TaskImageGallery task={task} />}

      <TaskActions task={task} />
    </div>
  );
}

export default memo(TaskDetailsContent);
