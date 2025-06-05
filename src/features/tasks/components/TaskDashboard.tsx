
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
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <TaskDashboardHeader />
        
        <main className="relative">
          <Suspense fallback={<UnifiedLoadingStates variant="skeleton" message="Loading tasks..." />}>
            <TaskList />
          </Suspense>
        </main>

        {isMobile && <FabButton />}
      </div>
    </div>
  );
}
