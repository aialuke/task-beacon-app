
import { memo } from "react";
import { Task } from "@/lib/types";
import { animated, SpringValue } from "@react-spring/web";
import { useUIContext } from "@/contexts/UIContext";
import TaskActions from "./TaskActions";
import TaskMetadata from "./TaskMetadata";
import ParentTaskInfo from "./ParentTaskInfo";

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
  const { isMobile } = useUIContext();

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
      className="w-full mt-2"
    >
      <div
        className={`space-y-4 ${isMobile ? "pl-4 pt-2 pb-4" : "pl-6 pt-3 pb-4"} bg-white bg-opacity-70 rounded-xl`}
        style={{ height: isExpanded ? "auto" : "0", overflowY: "hidden" }}
      >
        {task.description && (
          <div className="text-sm leading-relaxed text-gray-600">
            {task.description}
          </div>
        )}

        <TaskMetadata dueDate={task.due_date} url={task.url_link} />

        {task.parent_task && task.parent_task_id && (
          <ParentTaskInfo parentTask={task.parent_task} parentTaskId={task.parent_task_id} />
        )}

        {task.photo_url && (
          <div className="pt-1">
            <span className="text-sm font-medium text-gray-600 block mb-2">Photo:</span>
            <img
              src={task.photo_url}
              alt="Task attachment"
              className="h-24 w-auto object-cover rounded-xl shadow-sm"
              loading="lazy"
            />
          </div>
        )}

        <TaskActions task={task} />
      </div>
    </animated.div>
  );
}

export default memo(TaskDetails);
