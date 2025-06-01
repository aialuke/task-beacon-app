import TaskList from './TaskList';
import TaskDashboardHeader from './TaskDashboardHeader';
import { TaskProviders } from '@/features/tasks/providers/TaskProviders';

export default function TaskDashboard() {
  return (
    <TaskProviders>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-2 py-6 sm:px-4">
          <TaskDashboardHeader />

          {/* Main Content Section */}
          <main className="task-dashboard-main">
            <TaskList />
          </main>
        </div>
      </div>
    </TaskProviders>
  );
}
