
import { useState, useRef, useEffect, useCallback } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { Task } from "@/lib/types";
import CountdownTimer from "./CountdownTimer";
import { getStatusColor, getTaskStatus, truncateText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatDate, getOwnerName } from "@/lib/utils";
import TaskActions from "./TaskActions";
import { useTaskExpand } from "@/contexts/TaskExpandContext";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const {
    expandedTaskId,
    setExpandedTaskId,
    getTaskOffset,
    registerTaskHeight
  } = useTaskExpand();
  
  const isExpanded = expandedTaskId === task.id;
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const status = getTaskStatus(task);
  const statusColor = getStatusColor(status);
  const ownerName = getOwnerName(task.owner_id);

  // Register this task's expanded content height when it changes
  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      registerTaskHeight(task.id, height);
    }
  }, [task.id, registerTaskHeight]);

  // Spring animation for expanding/collapsing
  const expandAnimation = useSpring({
    height: isExpanded ? contentRef.current?.scrollHeight || 'auto' : 0,
    opacity: isExpanded ? 1 : 0,
    config: { tension: 280, friction: 24 },
    immediate: false
  });
  
  // Animation for moving cards below the expanded one
  const offsetAnimation = useSpring({
    transform: `translateY(${getTaskOffset(task.id)}px)`,
    config: config.gentle
  });

  const toggleExpand = useCallback(() => {
    setExpandedTaskId(isExpanded ? null : task.id);
  }, [isExpanded, task.id, setExpandedTaskId]);

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
    <animated.div 
      className="task-card-container will-change-transform"
      style={offsetAnimation}
    >
      <div 
        ref={cardRef}
        className={`task-card ${task.pinned ? 'border-l-4 border-l-primary' : ''} ${isExpanded ? 'expanded-card' : ''}`}
      >
        {/* Header section - always visible */}
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
            {task.description && !isExpanded && (
              <p className="truncate text-xs text-gray-600" title={task.description}>
                {truncateText(task.description, 20)}
              </p>
            )}
          </div>

          {/* Owner name and status moved to the right */}
          <div className="owner-name">
            {ownerName}
          </div>
          
          {/* Status ribbon (flat style) */}
          <div className={`status-ribbon ${statusColor}`}>
            {getStatusText(status)}
          </div>

          {/* Task expand button */}
          <Button 
            variant="ghost" 
            size="icon"
            className="shrink-0 h-8 w-8"
            onClick={toggleExpand}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
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

        {/* Expanded content - no border-t */}
        <animated.div 
          ref={contentRef}
          style={{
            ...expandAnimation,
            willChange: 'height, opacity',
            overflow: 'hidden',
          }}
          className="w-full mt-2"
        >
          <div className="space-y-2">
            {task.description && (
              <div>
                <p className="text-sm">{task.description}</p>
              </div>
            )}

            <div>
              <span className="text-xs font-medium text-gray-600">Due date:</span>
              <p className="text-sm">{formatDate(task.due_date)}</p>
            </div>

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
                  className="mt-1 h-20 w-20 object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
            )}
            
            <TaskActions task={task} />
          </div>
        </animated.div>
      </div>
    </animated.div>
  );
}
