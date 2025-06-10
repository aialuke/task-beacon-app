
import { animated, SpringValue } from "@react-spring/web";
import { memo } from "react";

import { Task } from "@/types";

import TaskDetailsContent from "./TaskDetailsContent";

interface TaskDetailsProps {
  task: Task;
  isExpanded: boolean;
  animationState: {
    height: SpringValue<number>;
    opacity: SpringValue<number>;
  };
  contentRef: React.RefObject<HTMLDivElement>;
  measureRef?: React.RefObject<HTMLDivElement>;
}

function TaskDetails({
  task,
  isExpanded,
  animationState,
  contentRef,
  measureRef,
}: TaskDetailsProps) {
  return (
    <animated.div
      ref={contentRef}
      style={{
        height: animationState.height,
        opacity: animationState.opacity,
        willChange: "height, opacity",
        overflow: "hidden",
        minHeight: 0,
      }}
      className="mt-1 w-full"
    >
      <div ref={measureRef}>
        <TaskDetailsContent task={task} isExpanded={isExpanded} />
      </div>
    </animated.div>
  );
}

export default memo(TaskDetails);
