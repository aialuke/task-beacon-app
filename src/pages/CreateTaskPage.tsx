import { ArrowLeft } from 'lucide-react';
import { lazy, Suspense } from 'react';

import { Button } from '@/components/ui/button';
import UnifiedErrorBoundary from '@/components/ui/UnifiedErrorBoundary';
import { useTaskNavigation } from '@/lib/navigation';

// Lazy load the form component for additional code splitting
const CreateTaskForm = lazy(
  () => import('@/features/tasks/forms/CreateTaskForm'),
);

export default function CreateTaskPage() {
  const { goToTaskList, goBack } = useTaskNavigation();

  const handleClose = () => {
    goToTaskList();
  };

  return (
    <UnifiedErrorBoundary variant="page">
      <div className="fixed inset-x-0 h-screen max-h-screen animate-fade-in touch-pan-y overflow-hidden overscroll-none bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <div className="mb-8 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
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
                    <p className="text-muted-foreground">Loading form...</p>
                  </div>
                </div>
              }
            >
              <CreateTaskForm onClose={handleClose} />
            </Suspense>
          </div>
        </div>
      </div>
    </UnifiedErrorBoundary>
  );
}
