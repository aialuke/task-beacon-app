
import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Task } from "@/lib/types";
import CountdownTimer from "./CountdownTimer";
import { getStatusColor, getTaskStatus, truncateText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import TaskActions from "./TaskActions";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  const status = getTaskStatus(task);
  const statusColor = getStatusColor(status);

  // Spring animation for expanding/collapsing
  const expandAnimation = useSpring({
    height: expanded ? "auto" : 0,
    opacity: expanded ? 1 : 0,
    config: { tension: 280, friction: 24 }
  });

  return (
    <div className={`task-card ${task.pinned ? 'border-l-4 border-l-primary' : ''}`}>
      {/* Status ribbon */}
      <div className={`status-ribbon ${statusColor}`}>
        {status === "complete" ? "Done" : status === "overdue" ? "Due" : "Soon"}
      </div>
      
      {/* Timer */}
      <div className="shrink-0">
        <CountdownTimer dueDate={task.due_date} status={status} />
      </div>

      {/* Task info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm text-gray-900 truncate" title={task.title}>
          {task.title}
        </h3>
        {task.description && (
          <p className="truncate text-xs text-gray-600" title={task.description}>
            {truncateText(task.description, 20)}
          </p>
        )}
      </div>

      {/* Task expand button */}
      <Button 
        variant="ghost" 
        size="icon"
        className="shrink-0 h-8 w-8"
        onClick={() => setExpanded(!expanded)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}
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

      {/* Expanded content */}
      <animated.div 
        style={expandAnimation}
        className="w-full absolute top-full left-0 mt-1 bg-white p-2 rounded-md shadow-md border border-blue-100 z-10 overflow-hidden"
      >
        <div className="space-y-2">
          <div>
            <span className="text-xs font-medium text-gray-600">Due date:</span>
            <p className="text-sm">{formatDate(task.due_date)}</p>
          </div>

          {task.description && (
            <div>
              <span className="text-xs font-medium text-gray-600">Description:</span>
              <p className="text-sm">{task.description}</p>
            </div>
          )}

          {task.url_link && (
            <div>
              <span className="text-xs font-medium text-gray-600">Link:</span>
              <a 
                href={task.url_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline block truncate"
              >
                {task.url_link}
              </a>
            </div>
          )}

          {task.photo_url && (
            <div>
              <span className="text-xs font-medium text-gray-600">Photo:</span>
              <img 
                src={task.photo_url} 
                alt="Task attachment" 
                className="mt-1 h-20 w-20 object-cover rounded-md"
                loading="lazy"
              />
            </div>
          )}
          
          <TaskActions task={task} />
        </div>
      </animated.div>
    </div>
  );
}
