
import { useRef, useState, useEffect, useCallback } from "react";
import { useSpring } from "@react-spring/web";
import { Task } from "@/lib/types";
import { useTaskExpand } from "@/contexts/TaskExpandContext";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "sonner";
import TaskHeader from "./TaskHeader";
import TaskDetails from "./TaskDetails";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
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
  
  return (
    <div className={`task-card-container ${isExpanded ? 'expanded' : ''}`}>
      <div 
        ref={cardRef} 
        className={`task-card ${isPinned ? 'border-l-4 border-l-primary' : ''} ${isExpanded ? 'expanded-card' : ''}`}
      >
        {/* Header section - always visible */}
        <TaskHeader
          task={task}
          isExpanded={isExpanded}
          isPinned={isPinned}
          pinLoading={pinLoading}
          toggleExpand={toggleExpand}
          handleTogglePin={handleTogglePin}
        />

        {/* Expanded content */}
        <TaskDetails 
          task={task}
          isPinned={isPinned}
          expandAnimation={expandAnimation}
          contentRef={contentRef}
        />
      </div>
    </div>
  );
}
