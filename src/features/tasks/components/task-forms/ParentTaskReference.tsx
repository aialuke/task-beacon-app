import { TaskWithRelations } from '@/types';

import { ReferenceCard } from './ReferenceCard';

interface ParentTaskReferenceProps {
  parentTask: NonNullable<TaskWithRelations['parent_task']>;
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
