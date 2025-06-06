import { useRef } from "react";
import { useTaskAnimation } from "./useTaskAnimation";
import type { Task } from "@/types";

export function useTaskCard(task: Task) {
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { isExpanded, animationPhase, animationState, toggleExpanded } =
    useTaskAnimation(contentRef);

  return {
    contentRef,
    cardRef,
    isExpanded,
    animationPhase,
    animationState,
    toggleExpand: toggleExpanded,
  };
}
