import { useRef, useState, useEffect, useCallback, useLayoutEffect } from "react";
import { useSpring, SpringValues } from "@react-spring/web";
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
  const { expandedTaskId, setExpandedTaskId, registerTaskHeight } = useTaskExpand();
  const [isPinned, setIsPinned] = useState(task.pinned);
  const [pinLoading, setPinLoading] = useState(false);
  const isExpanded = expandedTaskId === task.id;
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("TaskCard task:", task);
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      registerTaskHeight(task.id, height);
    }
  }, [task.id, registerTaskHeight, task]);

  const [expandAnimation] = useSpring(() => ({
    from: { height: 0, opacity: 0 },
    to: () => ({ height: isExpanded ? contentRef.current?.scrollHeight ?? 250 : 0, opacity: isExpanded ? 1 : 0 }),
    config: {
      tension: 210,
      friction: 24,
      clamp: true,
    },
    immediate: false,
  })) as [SpringValues<{ height: number; opacity: number }>, unknown];

  useLayoutEffect(() => {
    if (contentRef.current) {
      const height = isExpanded ? contentRef.current.scrollHeight : 0;
      expandAnimation.height.set(height);
      console.log("Content ref height:", height);
    }
  }, [isExpanded, expandAnimation.height, task]);

  const toggleExpand = useCallback(() => {
    setExpandedTaskId(isExpanded ? null : task.id);
    console.log("Task card classes:", `task-card ${isExpanded ? "expanded-card" : ""} p-3`);
  }, [isExpanded, task.id, setExpandedTaskId]);

  const handleTogglePin = async () => {
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
  };

  return (
    <div className={`task-card-container ${isExpanded ? "expanded" : ""}`}>
      <div
        ref={cardRef}
        className={`task-card ${isExpanded ? "expanded-card" : ""} p-3`}
        style={{ overflow: "visible", position: "relative", zIndex: 1 }}
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
          expandAnimation={expandAnimation}
          contentRef={contentRef}
        />
      </div>
    </div>
  );
}