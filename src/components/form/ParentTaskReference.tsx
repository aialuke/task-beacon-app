
import React from "react";
import { Task } from "@/types";
import { ReferenceCard } from "@/components/form/ReferenceCard";

interface ParentTaskReferenceProps {
  parentTask: Task;
}

export function ParentTaskReference({ parentTask }: ParentTaskReferenceProps) {
  return (
    <ReferenceCard
      title={parentTask.title}
      description={parentTask.description}
      url={parentTask.url_link}
      label="Following up on"
    />
  );
}
