import { useSuspenseQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import UnifiedErrorBoundary from '@/components/ui/UnifiedErrorBoundary';
import { QueryKeys } from '@/lib/api/standardized-api';
import { TaskService } from '@/lib/api/tasks';
import { useTaskNavigation } from '@/lib/navigation';

// Lazy load the form component for additional code splitting
const FollowUpTaskForm = lazy(
  () => import('@/features/tasks/forms/FollowUpTaskForm'),
);

export default function FollowUpTaskPage() {
  const { goBack, goToTaskList } = useTaskNavigation();
  const { parentTaskId } = useParams<{ parentTaskId: string }>();

  const { data: parentTask } = useSuspenseQuery({
    queryKey: QueryKeys.task(parentTaskId ?? ''),
    queryFn: async () => {
      if (!parentTaskId) throw new Error('parentTaskId is required');
      const response = await TaskService.crud.getById(parentTaskId);
      if (!response.success) {
        throw new Error(
          response.error?.message ?? 'Failed to load parent task',
        );
      }
      return response.data;
    },
    enabled: !!parentTaskId,
  });

  const handleClose = () => {
    goBack();
  };

  if (!parentTask) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <div className="mb-8 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                goToTaskList();
              }}
              className="rounded-full p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-accent/80 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-100 active:bg-accent/70"
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
                onClick={() => goToTaskList()}
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
    <UnifiedErrorBoundary variant="page">
      <div className="min-h-screen animate-fade-in bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <div className="mb-8 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToTaskList()}
              className="rounded-full p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-accent/80 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/30 active:scale-100 active:bg-accent/70"
            >
              <ArrowLeft className="size-5" />
            </Button>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-8">
                  <div className="space-y-4 text-center">
                    <div className="mx-auto size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-muted-foreground">
                      Loading follow-up form...
                    </p>
                  </div>
                </div>
              }
            >
              <FollowUpTaskForm parentTask={parentTask} onClose={handleClose} />
            </Suspense>
          </div>
        </div>
      </div>
    </UnifiedErrorBoundary>
  );
}
