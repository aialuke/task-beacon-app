import { Calendar1, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ParentTaskReference } from "@/components/form/ParentTaskReference";
import { formatDate, getTooltipContent } from "@/lib/utils/shared";
import { truncateText, truncateUrl } from "@/lib/utils/format";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Task } from "@/types";

import TaskActions from "../actions/TaskActions";

import { TaskImageGallery } from "./TaskImageGallery";



interface TaskDetailsContentProps {
  task: Task;
  isExpanded?: boolean;
}

export default function TaskDetailsContent({ task, isExpanded = false }: TaskDetailsContentProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Task Description */}
      {task.description && (
        <div>
          <p className="text-muted-foreground text-sm">
            {isExpanded ? task.description : truncateText(task.description, 150)}
          </p>
        </div>
      )}

      {/* Image Gallery */}
      <TaskImageGallery task={task} />

      {/* Date + URL Info (Combined Section) */}
      {(task.due_date || task.url_link) && (
        <div className="space-y-3">
          {task.due_date && (
            <div className="flex items-center gap-3">
              <Calendar1 className="text-muted-foreground size-4" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-muted-foreground text-sm cursor-help">
                      {formatDate(task.due_date)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    {getTooltipContent(task.due_date)}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {task.url_link && (
            <div className="flex items-center gap-2">
              <ExternalLink className="text-primary size-4" />
              <a
                href={task.url_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center gap-1 text-sm hover:underline"
                title={task.url_link}
              >
                {truncateUrl(task.url_link, 40)}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Parent Task Reference */}
      {task.parent_task && (
        <div>
          <ParentTaskReference parentTask={task.parent_task} />
        </div>
      )}

      {/* Single Border Separator + Action Buttons */}
      <div className="border-t pt-4">
        <TaskActions task={task} onView={() => { navigate(`/tasks/${task.id}`); }} isExpanded={isExpanded} />
      </div>
    </div>
  );
}
