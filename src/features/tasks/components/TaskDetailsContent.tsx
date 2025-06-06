import { Calendar1, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils/shared";
import { TaskImageGallery } from "./TaskImageGallery";
import { ParentTaskReference } from "@/components/form/ParentTaskReference";
import TaskActions from "./TaskActions";
import { getTaskStatus } from "../utils/taskUiUtils";
import { useNavigate } from "react-router-dom";
import type { Task } from "@/types";

interface TaskWithPartialRelations extends Omit<Task, "parent_task"> {
  parent_task?: Pick<Task, "id" | "title" | "description" | "url_link">;
}

interface TaskDetailsContentProps {
  task: TaskWithPartialRelations;
}

export default function TaskDetailsContent({ task }: TaskDetailsContentProps) {
  const navigate = useNavigate();
  const status = getTaskStatus(task);

  return (
    <div className="space-y-4 rounded-xl">
      <div className="flex items-start gap-3">
        {task.description && (
          <p className="text-sm text-muted-foreground">{task.description}</p>
        )}
      </div>

      <div className="border-t pt-4">
        <div className="mb-3 flex items-center gap-3">
          <Calendar1 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {task.due_date ? formatDate(task.due_date) : "No due date"}
          </span>
        </div>

        {task.url_link && (
          <div className="mb-3 flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-primary" />
            <a
              href={task.url_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              {task.url_link}
            </a>
          </div>
        )}
      </div>

      <TaskImageGallery task={task} className="border-t pt-4" />

      {task.parent_task && (
        <div className="border-t pt-4">
          <ParentTaskReference parentTask={task.parent_task} />
        </div>
      )}

      <div className="border-t pt-4">
        <TaskActions task={task} onView={() => navigate(`/tasks/${task.id}`)} />
      </div>
    </div>
  );
}
