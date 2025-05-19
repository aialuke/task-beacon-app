import { memo } from "react";
import { formatDate, truncateUrl, truncateDescription } from "@/lib/utils";
import { Task } from "@/lib/types";
import TaskActions from "../TaskActions";
import { Calendar1, ExternalLink } from "lucide-react";
import { animated } from "@react-spring/web";
import { useIsMobile } from "@/lib/mobile-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TaskDetailsProps {
  task: Task;
  isPinned: boolean;
  isExpanded: boolean;
  animationState: { height: number; opacity: number };
  contentRef: React.RefObject<HTMLDivElement>;
}

function TaskDetails({
  task,
  isPinned,
  isExpanded,
  animationState,
  contentRef,
}: TaskDetailsProps) {
  const isMobile = useIsMobile();

  return (
    <animated.div
      ref={contentRef}
      style={{
        height: animationState.height,
        opacity: animationState.opacity,
        willChange: "height, opacity",
        overflowY: "hidden",
        minHeight: 0,
        zIndex: 2,
        visibility: isExpanded ? "visible" : "hidden",
      }}
      className="w-full mt-1"
    >
      <div
        className={`space-y-2 ${isMobile ? "pl-4 pt-2 pb-4" : "pl-6 pt-2 pb-4"}`}
        style={{ height: isExpanded ? "auto" : "0", overflowY: "hidden" }}
      >
        <div className="flex items-center flex-wrap gap-4 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <Calendar1 size={16} className="text-task-overdue shrink-0" />
            <p className="text-sm text-gray-600">{task.due_date ? formatDate(task.due_date) : "No due date"}</p>
          </div>
          {task.url_link && (
            <div className="flex items-center gap-2 min-w-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={task.url_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline truncate max-w-[180px] sm:max-w-[280px]"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Open ${task.url_link} in new tab`}
                    >
                      <ExternalLink size={16} className="text-primary shrink-0" />
                      <span>{truncateUrl(task.url_link, 20)}</span>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{task.url_link}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        {task.parent_task && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200 line-clamp-2">
            <span className="font-medium">Following up on: </span>
            {task.parent_task.description ? (
              <>
                {truncateDescription(task.parent_task.description, 60)}
                {task.parent_task.description.length > 60 && (
                  <a
                    href={`/tasks/${task.parent_task.id}`}
                    className="text-primary hover:underline ml-1"
                    aria-label={`View details for parent task ${task.parent_task.title}`}
                  >
                    View more
                  </a>
                )}
              </>
            ) : (
              task.parent_task.title
            )}
          </div>
        )}

        {task.photo_url && (
          <div>
            <span className="text-sm font-medium text-gray-600">Photo:</span>
            <img
              src={task.photo_url}
              alt="Task attachment"
              className="mt-1 h-20 w-20 object-cover rounded-xl"
              loading="lazy"
            />
          </div>
        )}

        <TaskActions task={{ ...task, pinned: isPinned }} />
      </div>
    </animated.div>
  );
}

export default memo(TaskDetails);