import { memo } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { ParentTask } from "@/types/shared.types";

interface ParentTaskInfoProps {
  parentTask: ParentTask;
  parentTaskId: string;
}

function ParentTaskInfo({ parentTask, parentTaskId }: ParentTaskInfoProps) {
  return (
    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
      <span className="font-medium">Following up on: </span>
      <div className="mt-1">
        {parentTask.description ? (
          <p className="line-clamp-2">{parentTask.description}</p>
        ) : (
          <p>{parentTask.title}</p>
        )}
        <Link 
          to={`/tasks/${parentTaskId}`}
          className="text-primary hover:underline inline-flex items-center gap-1 mt-2"
          aria-label={`View details for original task ${parentTask.title}`}
        >
          <ExternalLink size={14} />
          <span>View Original Task</span>
        </Link>
      </div>
    </div>
  );
}

export default memo(ParentTaskInfo);
