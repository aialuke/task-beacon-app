import { useRef, useState, useEffect } from "react";
import { useTaskAnimation } from "./useTaskAnimation";
import type { Task } from "@/types";

export function useTaskCard(task: Task) {
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const {
    isExpanded,
    animationState, // Spring object
    toggleExpanded,
  } = useTaskAnimation(contentRef);

  // Temporary state for animation phase
  const [animationPhase, setAnimationPhase] = useState<"enter" | "exit" | "">(
    "enter"
  );

  // Simulate animation phase based on isExpanded
  useEffect(() => {
    if (isExpanded) {
      setAnimationPhase("enter");
    } else {
      setAnimationPhase("exit");
    }
  }, [isExpanded]);

  return {
    contentRef,
    cardRef,
    isExpanded,
    animationState,
    animationPhase, // String for class logic
    toggleExpand: toggleExpanded,
  };
}
