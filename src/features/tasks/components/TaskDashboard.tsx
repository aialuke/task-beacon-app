
// === EXTERNAL LIBRARIES ===
import { Suspense } from 'react';

// === INTERNAL UTILITIES ===
import UnifiedLoadingStates from '@/components/ui/loading/UnifiedLoadingStates';

// === COMPONENTS ===
import TaskDashboardHeader from './TaskDashboardHeader';
import TaskList from './TaskList';
import { FabButton } from './FabButton';

// === HOOKS ===
import { useTaskUIContext } from '@/features/tasks/context/TaskUIContext';

export default function TaskDashboard() {
  const { isMobile } = useTaskUIContext();

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TaskDashboardHeader />
      
      <main className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl h-full">
          <Suspense fallback={<UnifiedLoadingStates variant="skeleton" message="Loading tasks..." />}>
            <TaskList />
          </Suspense>
        </div>
      </main>

      {isMobile && <FabButton />}
    </div>
  );
}
