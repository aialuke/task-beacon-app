
import { formatDate } from "@/lib/utils";
import { Task } from "@/lib/types";
import TaskActions from "../TaskActions";
import { Calendar1, ExternalLink } from "lucide-react";
import { animated } from "@react-spring/web";

interface TaskDetailsProps {
  task: Task;
  isPinned: boolean;
  expandAnimation: any; // Spring animation type
  contentRef: React.RefObject<HTMLDivElement>;
}

export default function TaskDetails({ 
  task, 
  isPinned, 
  expandAnimation, 
  contentRef 
}: TaskDetailsProps) {
  return (
    <animated.div 
      ref={contentRef} 
      style={{
        ...expandAnimation,
        willChange: 'height, opacity',
        overflow: 'hidden'
      }} 
      className="w-full mt-2"
    >
      <div className="space-y-2 pl-[56px]">
        {/* Date and URL in same horizontal row */}
        <div className="flex items-center flex-wrap gap-x-6 gap-y-2">
          {/* Due date with calendar icon */}
          <div className="flex items-center gap-3">
            <Calendar1 size={16} className="text-primary shrink-0" />
            <p className="text-xs">{formatDate(task.due_date)}</p>
          </div>

          {/* URL link (if available) */}
          {task.url_link && (
            <div className="flex items-center gap-3">
              <ExternalLink size={16} className="text-primary shrink-0" />
              <a 
                href={task.url_link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-xs text-primary hover:underline truncate"
              >
                {task.url_link}
              </a>
            </div>
          )}
        </div>

        {task.photo_url && (
          <div>
            <span className="text-xs font-medium text-gray-600">Photo:</span>
            <img 
              src={task.photo_url} 
              alt="Task attachment" 
              className="mt-1 h-20 w-20 object-cover rounded-xl" 
              loading="lazy" 
            />
          </div>
        )}
        
        <TaskActions task={{...task, pinned: isPinned}} />
      </div>
    </animated.div>
  );
}
