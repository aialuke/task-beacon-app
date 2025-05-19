import { formatDate } from "@/lib/utils";
import { Task } from "@/lib/types";
import TaskActions from "../TaskActions";
import { Calendar1, ExternalLink } from "lucide-react";
import { animated } from "@react-spring/web";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

interface TaskDetailsProps {
  task: Task;
  isPinned: boolean;
  isExpanded: boolean;
  animationState: { height: number; opacity: number };
  contentRef: React.RefObject<HTMLDivElement>;
}

const truncateUrl = (url: string, maxLength: number = 20): string => {
  if (!url) return "";
  if (url.length <= maxLength) return url;

  try {
    const domain = new URL(url).hostname;
    if (domain.length <= maxLength) return domain;
    return `${domain.substring(0, maxLength - 1)}…`;
  } catch {
    return `${url.substring(0, maxLength - 1)}…`;
  }
};

const truncateDescription = (text: string, maxLength: number = 60): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 0 ? `${truncated.substring(0, lastSpace)}…` : `${truncated}…`;
};

export default function TaskDetails({
  task,
  isPinned,
  isExpanded,
  animationState,
  contentRef,
}: TaskDetailsProps) {
  const isMobile = useIsMobile();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    console.log("TaskDetails rendering:", {
      task,
      isExpanded,
      hasDueDate: !!task.due_date,
      hasUrl: !!task.url_link,
      hasParentTask: !!task.parent_task,
      hasPhoto: !!task.photo_url,
    });
    console.log("TaskDetails content:", {
      dueDate: task.due_date,
      urlLink: task.url_link,
      parentTask: task.parent_task,
      photoUrl: task.photo_url,
      taskActionsProps: { task, isPinned },
    });
    console.log("Animation state:", animationState);
    console.log("Content height:", contentRef.current?.offsetHeight, "scrollHeight:", contentRef.current?.scrollHeight);
  }, [task, isExpanded, animationState, contentRef]);

  useEffect(() => {
    if (isExpanded) {
      forceUpdate({});
    }
  }, [isExpanded]);

  console.log("TaskActions props:", { task, isPinned });

  return (
    <animated.div
      ref={contentRef}
      style={{
        height: animationState.height,
        opacity: animationState.opacity,
        willChange: "height, opacity",
        overflow: "visible",
        minHeight: isExpanded ? 500 : 0,
        zIndex: 2,
        visibility: isExpanded ? "visible" : "hidden",
      }}
      className="w-full mt-1"
    >
      <div
        className={`space-y-3 ${isMobile ? "pl-4 pt-2 pb-6" : "pl-6 pt-2 pb-6"}`}
        style={{ height: isExpanded ? "auto" : "0", minHeight: isExpanded ? 500 : 0 }}
      >
        <div className="flex items-center flex-wrap gap-4 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <Calendar1 size={16} className="text-task-overdue shrink-0" />
            <p className="text-sm">{task.due_date ? formatDate(task.due_date) : "No due date"}</p>
          </div>
          {task.url_link ? (
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
          ) : (
            <p className="text-sm text-gray-600">No URL link</p>
          )}
        </div>

        {task.parent_task ? (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200 line-clamp-2">
            <span className="font-medium">Following up on: </span>
            {task.parent_task.description ? (
              <>
                {truncateDescription(task.parent_task.description, 60)}
                {task.parent_task.description.length > 60 && (
                  <a
                    href={`/tasks/${task.parent_task.id}`}
                    className="text-primary hover:underline ml-1"
                  >
                    View more
                  </a>
                )}
              </>
            ) : (
              task.parent_task.title
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600">No parent task</p>
        )}

        {task.photo_url ? (
          <div>
            <span className="text-sm font-medium text-gray-600">Photo:</span>
            <img
              src={task.photo_url}
              alt="Task attachment"
              className="mt-1 h-20 w-20 object-cover rounded-xl"
              loading="lazy"
            />
          </div>
        ) : (
          <p className="text-sm text-gray-600">No photo</p>
        )}

        <TaskActions task={{ ...task, pinned: isPinned }} />
      </div>
    </animated.div>
  );
}