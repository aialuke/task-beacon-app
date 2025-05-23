
import React from "react";
import { Task } from "@/lib/types";

interface ParentTaskReferenceProps {
  parentTask: Task;
}

export function ParentTaskReference({ parentTask }: ParentTaskReferenceProps) {
  return (
    <div 
      className="p-2 bg-gray-50 rounded-xl" 
      style={{ 
        borderRadius: "var(--border-radius-xl)",
        border: "1px solid #e2e8f0" 
      }}
    >
      <h4 className="font-medium text-sm">Following up on: {parentTask.title}</h4>
    </div>
  );
}
