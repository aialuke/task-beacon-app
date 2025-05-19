import { useRef, useState, useEffect, useCallback, memo } from "react";
import { Task } from "@/lib/types";
import { useExpandedTask } from "@/contexts/ExpandedTaskContext";
import { useTaskHeight } from "@/contexts/TaskHeightContext";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "sonner";
import TaskHeader from "./TaskHeader";
import TaskDetails from "./TaskDetails";

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const { expandedTaskId, setExpandedTaskId } = useExpandedTask();
  const { registerTaskHeight } = useTaskHeight();
  const [isPinned, setIsPinned] = useState(task.pinned);
  const [pinLoading, setPinLoading] = useState(false);
  const isExpanded = expandedTaskId === task.id;
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [animationState, setAnimationState] = useState({ height: 0, opacity: 0 });

  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      registerTaskHeight(task.id, height);
    }
  }, [task.id, registerTaskHeight]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentRef.current) {
        const height = isExpanded ? Math.min(contentRef.current.scrollHeight, 400) : 0;
        setAnimationState({ height, opacity: isExpanded ? 1 : 0 });
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isExpanded, task]);

  const toggleExpand = useCallback(() => {
    setExpandedTaskId(isExpanded ? null : task.id);
  }, [isExpanded, task.id, setExpandedTaskId]);

  const handleTogglePin = useCallback(async () => {
    setPinLoading(true);
    const newPinnedState = !isPinned;

    try {
      if (isMockingSupabase) {
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
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        toast.error((error as { message: string }).message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setPinLoading(false);
    }
  }, [isPinned, task.id, isMockingSupabase]);

  return (
    <div className={`task-card-container ${isExpanded ? "expanded" : ""}`} style={{ overflowY: "hidden", boxSizing: "border-box", width: "100%", position: "relative", zIndex: 1, scrollbarWidth: "none", msOverflowStyle: "none" }}>
      <div
        ref={cardRef}
        className={`task-card ${isExpanded ? "expanded-card" : ""} p-3`}
        style={{ overflowY: "hidden", boxSizing: "border-box", width: "100%", position: "relative", zIndex: 1 }}
      >
        <TaskHeader
          task={task}
          isExpanded={isExpanded}
          isPinned={isPinned}
          pinLoading={pinLoading}
          toggleExpand={toggleExpand}
          handleTogglePin={handleTogglePin}
        />
        <TaskDetails
          task={task}
          isPinned={isPinned}
          isExpanded={isExpanded}
          animationState={animationState}
          contentRef={contentRef}
        />
      </div>
    </div>
  );
}

export default memo(TaskCard);