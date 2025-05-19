// src/components/TaskHeader.tsx
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import { getStatusColor, getTaskStatus, truncateText } from "@/lib/utils";
import { useSpring, animated, SpringValues } from "@react-spring/web";
import { useRef, memo } from "react";
import CountdownTimer from "../CountdownTimer";
import { Pin } from "lucide-react";
import { useIsMobile } from "@/lib/mobile-utils";

interface TaskHeaderProps {
  task: Task;
  isExpanded: boolean;
  isPinned: boolean;
  pinLoading: boolean;
  toggleExpand: () => void;
  handleTogglePin: () => void;
}

function TaskHeader({
  task,
  isExpanded,
  isPinned,
  pinLoading,
  toggleExpand,
  handleTogglePin,
}: TaskHeaderProps) {
  const status = getTaskStatus(task);
  const statusColor = getStatusColor(status);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const descriptionAnimation = useSpring({
    height: isExpanded ? descriptionRef.current?.scrollHeight || 16 : 16,
    opacity: isExpanded ? 1 : 0, // Changed to animate opacity for fade effect
    config: {
      tension: 200,
      friction: 20,
      clamp: true,
    },
    immediate: false,
  }) as SpringValues<{ height: number; opacity: number }>;

  return (
    <div className="flex items-center w-full gap-2 task-header-container">
      <div className="shrink-0">
        <CountdownTimer dueDate={task.due_date} status={status} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-xs sm:text-base text-gray-900 truncate mb-0" title={task.title}>
          {task.title}
        </h3>

        {task.description && (
          <animated.div
            ref={descriptionRef}
            style={{
              ...descriptionAnimation,
              willChange: "height, opacity",
              overflow: "hidden",
              position: "relative",
            }}
            className={`text-xs sm:text-sm text-gray-600 ${isMobile ? "mobile-description-container" : ""}`}
          >
            <div className={`${!isExpanded ? "truncate w-full" : ""}`}>
              {isExpanded ? task.description : truncateText(task.description, isMobile ? 25 : 40)}
            </div>
          </animated.div>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 h-8 w-8 ml-1"
        onClick={handleTogglePin}
        disabled={pinLoading}
        title={isPinned ? "Unpin task" : "Pin task"}
      >
        {isPinned ? (
          <Pin size={16} className="text-gray-900" fill="currentColor" />
        ) : (
          <Pin size={16} className="text-gray-900" style={{ opacity: 0.8 }} />
        )}
      </Button>

      <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={toggleExpand}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </div>
  );
}

export default memo(TaskHeader);