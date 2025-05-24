
import { useSpring, SpringValue } from "@react-spring/web";
import { useEffect, useRef } from "react";

export interface TaskCardAnimationState {
  height: SpringValue<number>;
  opacity: SpringValue<number>;
}

/**
 * Custom hook for TaskCard animations
 * 
 * Handles the expand/collapse animation logic for task card content
 * 
 * @param contentRef - Ref to the content element being animated
 * @param isExpanded - Whether the content should be expanded
 * @returns Animation state for the content
 */
export function useTaskCardAnimation(
  contentRef: React.RefObject<HTMLDivElement> | null,
  isExpanded: boolean
): TaskCardAnimationState {
  const initialHeightRef = useRef<number | null>(null);
  
  const [animationProps, setAnimationProps] = useSpring(() => ({
    height: 0,
    opacity: 0,
    config: { tension: 280, friction: 60 },
  }));

  useEffect(() => {
    if (!contentRef?.current) return;

    // Get scrollHeight for complete content height including any overflow
    const contentHeight = contentRef.current.scrollHeight;

    // Store initial height for animations
    if (!initialHeightRef.current) {
      initialHeightRef.current = contentHeight;
    }

    const height = isExpanded ? contentHeight : 0;
    const opacity = isExpanded ? 1 : 0;

    setAnimationProps.start({ 
      height,
      opacity,
      immediate: false,
      // Reset height to auto after animation completes if expanded
      onRest: () => {
        if (isExpanded && contentRef.current) {
          contentRef.current.style.height = 'auto';
        }
      }
    });
  }, [isExpanded, contentRef, setAnimationProps]);

  return animationProps;
}
