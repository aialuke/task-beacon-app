import { Suspense } from 'react';
import TaskCardCollapsibleTest from '@/features/tasks/components/task-visualization/TaskCardCollapsibleTest';

function TaskCardTest() {
  return (
    <Suspense fallback={<div className="p-8">Loading test environment...</div>}>
      <TaskCardCollapsibleTest />
    </Suspense>
  );
}

export default TaskCardTest;