
import React from "react";
import { Task } from "@/lib/types";
import { useBorderRadius } from "@/contexts/BorderRadiusContext";

interface ParentTaskReferenceProps {
  parentTask: Task;
}

export function ParentTaskReference({ parentTask }: ParentTaskReferenceProps) {
  const borderStyles = useBorderRadius();
  
  return (
    <div 
      className="p-2 bg-gray-50 rounded-xl" 
      style={{ 
        borderRadius: "0.75rem",
        WebkitBorderRadius: "0.75rem",
        MozBorderRadius: "0.75rem",
        border: "1px solid #e2e8f0" 
      }}
    >
      <h4 className="font-medium text-sm">Following up on: {parentTask.title}</h4>
    </div>
  );
}
