import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import FollowUpTaskForm from '@/features/tasks/forms/FollowUpTaskForm';
import { TaskService } from '@/lib/api/tasks/task.service';
import { Skeleton } from '@/components/ui/skeleton';

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
      const response = await TaskService.getById(parentTaskId!);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to load parent task');
      }
      return response.data;
    },
    enabled: !!parentTaskId,
  });

  const handleClose = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="h-screen max-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <div className="mb-8 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="rounded-full p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-accent/80 hover:shadow-md"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-6 rounded-2xl border border-border/50 bg-card/50 p-8 shadow-lg backdrop-blur-sm">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !parentTask) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <div className="mb-8 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="rounded-full p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-accent/80 hover:shadow-md"
            >
              <ArrowLeft className="h-5 w-5" />
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
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <FollowUpTaskForm parentTask={parentTask} onClose={handleClose} />
        </div>
      </div>
    </div>
  );
}
