
import { Suspense, memo, lazy } from 'react';
import TaskDashboardHeader from './TaskDashboardHeader';
import { TaskProviders } from '@/features/tasks/providers/TaskProviders';
import { TaskErrorBoundary } from './TaskErrorBoundary';
import { TaskPageLoader } from './TaskLoadingStates';

// Correctly lazy load the enhanced task list
const EnhancedTaskList = lazy(() => import('./EnhancedTaskList'));

/**
 * Task Dashboard - Phase 4 Enhanced
 * 
 * Features:
 * - Lazy loading for better performance
 * - Enhanced error boundaries
 * - Optimized provider structure
 * - Better accessibility
 */
function TaskDashboard() {
  return (
    <TaskProviders>
      <TaskErrorBoundary>
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-3xl px-2 py-6 sm:px-4">
            <TaskDashboardHeader />

            {/* Main Content Section with Suspense */}
            <main className="task-dashboard-main" role="main">
              <Suspense fallback={
                <TaskPageLoader message="Loading enhanced task interface..." />
              }>
                <EnhancedTaskList />
              </Suspense>
            </main>
          </div>
        </div>
      </TaskErrorBoundary>
    </TaskProviders>
  );
}

TaskDashboard.displayName = 'TaskDashboard';
export default memo(TaskDashboard);
