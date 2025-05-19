import { useRef, useState, useEffect, useCallback } from "react";
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
    console.log("TaskCard task:", {
      id: task.id,
      title: task.title,
      due_date: task.due_date,
      url_link: task.url_link,
      parent_task: task.parent_task,
      photo_url: task.photo_url,
      pinned: task.pinned,
    });
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      registerTaskHeight(task.id, height);
    }
  }, [task.id, registerTaskHeight, task]);

  useEffect(() => {
    console.log("isExpanded state:", isExpanded, "taskId:", task.id);
  }, [isExpanded, task.id]);

  const [expandAnimation] = useSpring(() => ({
    from: { height: 0 },
    to: { height: isExpanded ? (contentRef.current?.scrollHeight ?? 500) : 0 },
    config: { tension: 210, friction: 24, clamp: true },
    onRest: () => console.log("Height animation completed:", isExpanded ? contentRef.current?.scrollHeight : 0),
  })) as [SpringValues<{ height: number }>, unknown];

  const [opacityAnimation] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: isExpanded ? 1 : 0 },
    config: { tension: 210, friction: 24, clamp: true },
    onRest: () => console.log("Opacity animation completed:", isExpanded ? 1 : 0),
  })) as [SpringValues<{ opacity: number }>, unknown];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentRef.current) {
        const height = isExpanded ? contentRef.current.scrollHeight : 0;
        expandAnimation.height.set(height);
        console.log("Content ref height:", height);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isExpanded, expandAnimation.height, task]);

  const toggleExpand = useCallback(() => {
    console.log("Toggling expand, current isExpanded:", isExpanded, "taskId:", task.id);
    setExpandedTaskId(isExpanded ? null : task.id);
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
    <div className={`task-card-container ${isExpanded ? "expanded" : ""}`} style={{ overflow: "visible", minHeight: isExpanded ? 500 : 0, position: "relative", zIndex: 1 }}>
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
          opacityAnimation={opacityAnimation}
          contentRef={contentRef}
        />
      </div>
    </div>
  );
}