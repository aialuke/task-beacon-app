
import { useSpring, SpringValue } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";

export interface TaskAnimationState {
  height: SpringValue<number>;
  opacity: SpringValue<number>;
  animationPhase: "enter" | "exit" | "";
}

export function useTaskAnimation(contentRef: React.RefObject<HTMLDivElement>) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<"enter" | "exit" | "">(
    "enter"
  );
  const initialHeightRef = useRef<number | null>(null);

  const [animationProps, setAnimationProps] = useSpring(() => ({
    height: 0,
    opacity: 0,
    config: { tension: 240, friction: 36 },
  }));

  const toggleExpanded = () => {
    setIsExpanded((prev) => {
      setAnimationPhase(prev ? "exit" : "enter");
      return !prev;
    });
  };

  useEffect(() => {
    if (!contentRef.current) return;
    
    const contentHeight = contentRef.current.scrollHeight;
    if (!initialHeightRef.current) {
      initialHeightRef.current = contentHeight;
    }
    
    const targetHeight = isExpanded ? contentHeight : 0;
    const targetOpacity = isExpanded ? 1 : 0;
    
    setAnimationProps.start({
      height: targetHeight,
      opacity: targetOpacity,
      immediate: false,
      onRest: () => {
        if (isExpanded && contentRef.current) {
          // Allow natural height when fully expanded
          contentRef.current.style.height = "auto";
        }
      },
    });
  }, [isExpanded, contentRef, setAnimationProps]);

  return {
    isExpanded,
    toggleExpanded,
    animationState: {
      ...animationProps,
      animationPhase,
    },
    animationPhase,
  };
}
