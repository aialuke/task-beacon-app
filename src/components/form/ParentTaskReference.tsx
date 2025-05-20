
import React from "react";
import { Task } from "@/lib/types";

interface ParentTaskReferenceProps {
  parentTask: Task;
}

export function ParentTaskReference({ parentTask }: ParentTaskReferenceProps) {
  return (
    <div className="p-2 bg-gray-50 rounded-md">
      <h4 className="font-medium text-sm">Following up on: {parentTask.title}</h4>
    </div>
  );
}
