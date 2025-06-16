import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/ui/loading/UnifiedLoadingStates';
import { TaskService } from '@/lib/api/tasks';

// Lazy load the form component for additional code splitting
const FollowUpTaskForm = lazy(
  () => import('@/features/tasks/forms/FollowUpTaskForm')
);

export default function FollowUpTaskPage() {
  const navigate = useNavigate();
  const { parentTaskId } = useParams<{ parentTaskId: string }>();

  const {
    data: parentTask,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['task', parentTaskId],
    queryFn: async () => {
      if (!parentTaskId) throw new Error('parentTaskId is required');
      const response = await TaskService.crud.getById(parentTaskId);
      if (!response.success) {
        throw new Error(
          response.error?.message || 'Failed to load parent task'
        );
      }
      return response.data;
    },
    enabled: !!parentTaskId,
  });

  const handleClose = () => {
    navigate('/');
  };

  if (isLoading) {
    return <PageLoader message="Loading parent task data..." />;
  }

  if (error ?? !parentTask) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <div className="mb-8 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigate('/');
              }}
              className="rounded-full p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-accent/80 hover:shadow-md"
            >
              <ArrowLeft className="size-5" />
            </Button>
          </div>
          <div className="rounded-2xl border border-border/50 bg-card/50 py-12 text-center shadow-lg backdrop-blur-sm">
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground">
                Task not found or error loading task.
              </p>
              <Button
                onClick={() => navigate('/')}
                className="mt-6 rounded-full px-6 py-2"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-fade-in bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="rounded-full p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-accent/80 hover:shadow-md"
          >
            <ArrowLeft className="size-5" />
          </Button>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Suspense
            fallback={<PageLoader message="Loading follow-up form..." />}
          >
            <FollowUpTaskForm parentTask={parentTask} onClose={handleClose} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
