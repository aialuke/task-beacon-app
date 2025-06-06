import { useRef } from "react";
import { useTaskAnimation } from "./useTaskAnimation";
import type { Task } from "@/types";
import type { SpringValue } from "@react-spring/web";

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
    animationState: {
      ...animationState,
      animationPhase,
    },
    toggleExpand: toggleExpanded,
  };
}
