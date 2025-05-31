
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RealtimeStatus from '@/components/RealtimeStatus';

function TaskDashboardHeader() {
  const navigate = useNavigate();

  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Tasks
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage your tasks and stay organized
          </p>
        </div>
        <RealtimeStatus />
      </div>

      <Button
        onClick={() => navigate('/create-task')}
        className="flex items-center gap-2"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Create Task</span>
      </Button>
    </header>
  );
}

export default memo(TaskDashboardHeader);
