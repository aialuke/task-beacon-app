
import { formatDate } from "@/lib/utils";
import { Task } from "@/lib/types";
import TaskActions from "../TaskActions";
import { Calendar1, ExternalLink } from "lucide-react";
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

const truncateUrl = (url: string, maxLength: number = 15): string => {
  if (!url) return '';
  if (url.length <= maxLength) return url;
  
  // Get domain from URL
  try {
    const domain = new URL(url).hostname;
    if (domain.length <= maxLength) return domain;
    return `${domain.substring(0, maxLength)}…`;
  } catch {
    // If URL parsing fails, just truncate the original URL
    return `${url.substring(0, maxLength)}…`;
  }
};

export default function TaskDetails({ 
  task, 
  isPinned, 
  expandAnimation, 
  contentRef 
}: TaskDetailsProps) {
  const isMobile = useIsMobile();
  
  return (
    
      <div className={`space-y-3 pl-[56px] ${isMobile ? 'pt-1' : ''}`}>
        {/* Date and URL in same horizontal row */}
        <div className="flex items-center flex-wrap gap-x-6 gap-y-2">
          {/* Due date with calendar icon */}
          <div className="flex items-center gap-3">
            <Calendar1 size={16} className="text-task-overdue shrink-0" />
            <p className="text-xs">{formatDate(task.due_date)}</p>
          </div>

          {/* URL link (if available) - with tooltip and improved truncation */}
          {task.url_link && (
            <div className="flex items-center gap-2">
              <ExternalLink size={16} className="text-primary shrink-0" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a 
                      href={task.url_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-primary hover:underline truncate max-w-[120px] sm:max-w-xs external-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {truncateUrl(task.url_link, 15)}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{task.url_link}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* Show parent task summary for follow-up tasks */}
        {task.parent_task && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <span className="font-medium">Following up on: </span>
            {task.parent_task.description ? 
              (task.parent_task.description.length > 50 ? 
                `${task.parent_task.description.substring(0, 50)}...` : 
                task.parent_task.description) : 
              task.parent_task.title}
          </div>
        )}

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
  )}
