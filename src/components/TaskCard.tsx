
import { useRef, useEffect, useCallback, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { Task } from "@/lib/types";
import CountdownTimer from "./CountdownTimer";
import { getStatusColor, getTaskStatus, truncateText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import TaskActions from "./TaskActions";
import { useTaskExpand } from "@/contexts/TaskExpandContext";
import { Link, Calendar, Pin, PinOff } from "lucide-react";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({
  task
}: TaskCardProps) {
  const {
    expandedTaskId,
    setExpandedTaskId,
    registerTaskHeight
  } = useTaskExpand();
  
  const [isPinned, setIsPinned] = useState(task.pinned);
  const [pinLoading, setPinLoading] = useState(false);
  const isExpanded = expandedTaskId === task.id;
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const status = getTaskStatus(task);
  const statusColor = getStatusColor(status);

  // Register this task's expanded content height when it changes
  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      registerTaskHeight(task.id, height);
    }
  }, [task.id, registerTaskHeight]);

  // Spring animation for expanding/collapsing with improved settings
  const expandAnimation = useSpring({
    height: isExpanded ? contentRef.current?.scrollHeight || 'auto' : 0,
    opacity: isExpanded ? 1 : 0,
    config: {
      tension: 210,  // Adjusted tension for smooth expansion
      friction: 24,  // Balanced friction
      clamp: false   // No clamping for smoother end of animation
    },
    immediate: false
  });

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

  const toggleExpand = useCallback(() => {
    setExpandedTaskId(isExpanded ? null : task.id);
  }, [isExpanded, task.id, setExpandedTaskId]);
  
  const handleTogglePin = async () => {
    setPinLoading(true);
    const newPinnedState = !isPinned;
    
    try {
      if (isMockingSupabase) {
        // Mock behavior for development
        toast.success(`Task ${isPinned ? "unpinned" : "pinned"} successfully (mock)`);
        setIsPinned(newPinnedState);
        setTimeout(() => setPinLoading(false), 500);
        return;
      }
      
      const { error } = await supabase
        .from("tasks")
        .update({ pinned: newPinnedState })
        .eq("id", task.id);

      if (error) throw error;
      
      setIsPinned(newPinnedState);
      toast.success(`Task ${isPinned ? "unpinned" : "pinned"} successfully`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPinLoading(false);
    }
  };
  
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
    <div className={`task-card-container ${isExpanded ? 'expanded' : ''}`}>
      <div 
        ref={cardRef} 
        className={`task-card ${isPinned ? 'border-l-4 border-l-primary' : ''} ${isExpanded ? 'expanded-card' : ''}`}
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
          
          {/* Status ribbon - moved left */}
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
              <Pin size={16} className="text-primary" style={{ color: '#3662E3' }} /> : 
              <PinOff size={16} className="text-gray-500" style={{ opacity: 0.9 }} />
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

        {/* Expanded content */}
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
                <Calendar size={16} className="text-primary shrink-0" />
                <p className="text-xs">{formatDate(task.due_date)}</p>
              </div>

              {/* URL link (if available) */}
              {task.url_link && (
                <div className="flex items-center gap-3">
                  <Link size={16} className="text-primary shrink-0" />
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
      </div>
    </div>
  );
}
