
import { useState, useEffect, RefObject } from "react";

export function useTaskAnimation(
  contentRef: RefObject<HTMLDivElement>,
  isExpanded: boolean
) {
  const [animationState, setAnimationState] = useState({ height: 0, opacity: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentRef.current) {
        const height = isExpanded ? Math.min(contentRef.current.scrollHeight, 400) : 0;
        setAnimationState({ height, opacity: isExpanded ? 1 : 0 });
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [isExpanded, contentRef]);

  return { animationState };
}
