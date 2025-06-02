import TaskList from './TaskList';
import TaskDashboardHeader from './TaskDashboardHeader';
import { TaskProviders } from '@/features/tasks/providers/TaskProviders';
import PerformanceMonitor from '@/components/monitoring/PerformanceMonitor';
import { TaskErrorBoundary } from './TaskErrorBoundary';

export default function TaskDashboard() {
  return (
    <TaskProviders>
      <TaskErrorBoundary>
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-3xl px-2 py-6 sm:px-4">
            <TaskDashboardHeader />

            {/* Main Content Section */}
            <main className="task-dashboard-main">
              <TaskList />
            </main>
          </div>
        </div>

        {/* Performance monitoring - only shows in development */}
        <PerformanceMonitor />
      </TaskErrorBoundary>
    </TaskProviders>
  );
}
