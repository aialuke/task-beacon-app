
// === EXTERNAL LIBRARIES ===
import { Suspense } from 'react';

// === INTERNAL UTILITIES ===
import UnifiedLoadingStates from '@/components/ui/loading/UnifiedLoadingStates';

// === COMPONENTS ===
import TaskDashboardHeader from './TaskDashboardHeader';
import TaskList from './TaskList';
import FabButton from './FabButton';

// === HOOKS ===
import { useTaskUIContext } from '@/features/tasks/context/TaskUIContext';

// === TYPES ===
import type { Task } from '@/types';

export default function TaskDashboard() {
  const { isMobile } = useTaskUIContext();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TaskDashboardHeader />
      
      <main className="flex-1 overflow-hidden">
        <Suspense fallback={<UnifiedLoadingStates variant="list" message="Loading tasks..." />}>
          <TaskList />
        </Suspense>
      </main>

      {isMobile && <FabButton />}
    </div>
  );
}
