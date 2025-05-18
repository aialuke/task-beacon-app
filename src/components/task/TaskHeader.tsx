
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import { getStatusColor, getTaskStatus, truncateText } from "@/lib/utils";
import { useSpring, animated } from "@react-spring/web";
import { useRef } from "react";
import CountdownTimer from "../CountdownTimer";
import { Pin } from "lucide-react";

interface TaskHeaderProps {
  task: Task;
  isExpanded: boolean;
  isPinned: boolean;
  pinLoading: boolean;
  toggleExpand: () => void;
  handleTogglePin: () => void;
}

export default function TaskHeader({
  task,
  isExpanded,
  isPinned,
  pinLoading,
  toggleExpand,
  handleTogglePin
}: TaskHeaderProps) {
  const status = getTaskStatus(task);
  const statusColor = getStatusColor(status);
  const descriptionRef = useRef<HTMLDivElement>(null);

  // Animation for description text
  const descriptionAnimation = useSpring({
    height: isExpanded ? descriptionRef.current?.scrollHeight || 'auto' : '16px',
    opacity: isExpanded ? 1 : 1,
    config: {
      tension: 200,
      friction: 20
    },
    immediate: false
  });

  const getStatusText = (status: string) => {
    switch (status) {
      case "complete":
        return "Complete";
      case "overdue":
        return "Overdue";
      case "pending":
      default:
        return "Pending";
    }
  };
  
  return (
    <div className="flex items-center w-full gap-2">
      {/* Timer */}
      <div className="shrink-0">
        <CountdownTimer dueDate={task.due_date} status={status} />
      </div>

      {/* Task info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm text-gray-900 truncate" title={task.title}>
          {task.title}
        </h3>
        
        {/* Animated description container */}
        {task.description && (
          <animated.div 
            ref={descriptionRef} 
            style={{
              ...descriptionAnimation,
              willChange: 'height, opacity',
              overflow: 'hidden',
              position: 'relative'
            }} 
            className="text-xs text-gray-600"
          >
            <div className={`absolute left-0 top-0 ${!isExpanded ? 'truncate w-full' : ''}`}>
              {isExpanded ? task.description : truncateText(task.description, 20)}
            </div>
          </animated.div>
        )}
      </div>
      
      {/* Status ribbon */}
      <div className={`status-ribbon ${statusColor}`} style={{ position: 'relative', right: 0 }}>
        {getStatusText(status)}
      </div>

      {/* Pin button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="shrink-0 h-8 w-8 ml-1"
        onClick={handleTogglePin}
        disabled={pinLoading}
        title={isPinned ? "Unpin task" : "Pin task"}
      >
        {isPinned ? 
          <Pin size={16} className="text-gray-900" fill="currentColor" /> : 
          <Pin size={16} className="text-gray-900" style={{ opacity: 0.8 }} />
        }
      </Button>

      {/* Task expand button */}
      <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={toggleExpand}>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        >
          <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>
    </div>
  );
}
