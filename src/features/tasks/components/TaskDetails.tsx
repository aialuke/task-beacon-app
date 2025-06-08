
import { memo } from "react";
import { Task } from "@/types";
import { animated, SpringValue } from "@react-spring/web";
import TaskDetailsContent from "./TaskDetailsContent";

interface TaskDetailsProps {
  task: Task;
  isExpanded: boolean;
  animationState: {
    height: SpringValue<number>;
    opacity: SpringValue<number>;
  };
  contentRef: React.RefObject<HTMLDivElement>;
}

function TaskDetails({
  task,
  isExpanded,
  animationState,
  contentRef,
}: TaskDetailsProps) {
  return (
    <animated.div
      ref={contentRef}
      style={{
        height: animationState.height,
        opacity: animationState.opacity,
        willChange: "height, opacity",
        overflowY: "hidden",
        minHeight: 0,
        zIndex: 2,
        visibility: isExpanded ? "visible" : "hidden",
      }}
      className="mt-1 w-full"
    >
      <TaskDetailsContent task={task} isExpanded={isExpanded} />
    </animated.div>
  );
}

export default memo(TaskDetails);
// CodeRabbit review
// CodeRabbit review
