import { useRef } from "react";

import type { Task } from "@/types";

import { useTaskAnimation } from "./useTaskAnimation";

export function useTaskCard(_task: Task) {
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { isExpanded, animationState, toggleExpanded, measureRef } =
    useTaskAnimation();

  return {
    contentRef,
    cardRef,
    isExpanded,
    animationState,
    toggleExpand: toggleExpanded,
    measureRef,
  };
}
