import TaskDashboard from '@/features/tasks/components/lists/TaskDashboard';
import { TaskProviders } from '@/features/tasks/providers/TaskProviders';

const DashboardPage = () => {
  return (
    <TaskProviders>
      <TaskDashboard />
    </TaskProviders>
  );
};

export default DashboardPage;
