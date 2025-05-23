
// Move from src/hooks/useTaskAnimation.ts
import { useSpring } from "@react-spring/web";
import { useEffect, useRef } from "react";

export function useTaskAnimation(
  contentRef: React.RefObject<HTMLDivElement>,
  isExpanded: boolean
) {
  const initialHeightRef = useRef<number | null>(null);
  
  const [animationProps, setAnimationProps] = useSpring(() => ({
    height: 0,
    opacity: 0,
    config: { tension: 280, friction: 60 },
  }));

  useEffect(() => {
    if (!contentRef.current) return;

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

  return {
    animationState: animationProps
  };
}
