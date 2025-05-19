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

interface TaskDetailsProps {
  task: Task;
  isPinned: boolean;
  expandAnimation: any; // Spring animation type
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
  // Truncate at word boundary
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 0 ? `${truncated.substring(0, lastSpace)}…` : `${truncated}…`;
};

export default function TaskDetails({
  task,
  isPinned,
  expandAnimation,
  contentRef,
}: TaskDetailsProps) {
  const isMobile = useIsMobile();

  return (
    <animated.div
      ref={contentRef}
      style={{
        ...expandAnimation,
        willChange: "height, opacity",
        overflow: "hidden",
        minHeight: isMobile ? "100px" : "120px", // Prevent clipping during animation
      }}
      className="w-full mt-3"
    >
      <div
        className={`space-y-3 ${isMobile ? "pl-4 pt-2" : "pl-14"}`} // 16px mobile margin, 56px desktop
      >
        {/* Date and URL in same horizontal row */}
        <div className="flex items-center flex-wrap gap-4 min-w-0">
          {/* Due date with calendar icon */}
          <div className="flex items-center gap-3 min-w-0">
            <Calendar1 size={16} className="text-task-overdue shrink-0" />
            <p className="text-sm">{formatDate(task.due_date)}</p> {/* Increased to text-sm */}
          </div>

          {/* URL link (if available) - clickable icon and text */}
          {task.url_link && (
            <div className="flex items-center gap-2 min-w-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={task.url_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline truncate max-w-[140px] sm:max-w-[200px]" // Wider max-width
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink size={16} className="text-primary shrink-0" />
                      <span>{truncateUrl(task.url_link, 20)}</span> {/* Increased to 20 chars */}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm">{task.url_link}</p> {/* Match text-sm */}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        <TaskActions task={{ ...task, pinned: isPinned }} />
      </div>
    </animated.div>
  );
}