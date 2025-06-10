import { useSpring, SpringValue } from "@react-spring/web";
import { useState, useRef, useLayoutEffect } from "react";

import { useTaskCardAnimation } from "@/animations";
import { useMotionPreferenceContext } from "@/contexts/MotionPreferenceContext";

export interface TaskAnimationState {
  height: SpringValue<number>;
  opacity: SpringValue<number>;
}

export function useTaskAnimation() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState(0);
  const measureRef = useRef<HTMLDivElement>(null);
  
  const { expandConfig } = useTaskCardAnimation();
  const { getAnimationConfig } = useMotionPreferenceContext();
  
  // Get animation config with motion preference support
  const animationConfig = getAnimationConfig(expandConfig);

  // Measure content height when expanded state changes
  useLayoutEffect(() => {
    if (isExpanded && measureRef.current) {
      // Temporarily show content to measure its height
      const element = measureRef.current;
      const originalHeight = element.style.height;
      const originalOverflow = element.style.overflow;
      
      element.style.height = 'auto';
      element.style.overflow = 'visible';
      
      const rect = element.getBoundingClientRect();
      setMeasuredHeight(rect.height);
      
      // Restore original styles
      element.style.height = originalHeight;
      element.style.overflow = originalOverflow;
    }
  }, [isExpanded]);

  const animationProps = useSpring({
    height: isExpanded ? measuredHeight : 0,
    opacity: isExpanded ? 1 : 0,
    config: animationConfig,
    immediate: false,
  });

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  return {
    isExpanded,
    toggleExpanded,
    animationState: animationProps,
    measureRef, // Expose ref for height measurement
  };
}
