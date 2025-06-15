import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

// Import from feature public API for better code splitting
import { CreateTaskForm } from '@/features/tasks';
import { Button } from '@/shared/components/ui/button';
import { PageLoader } from '@/shared/components/ui/loading/UnifiedLoadingStates';

export default function CreateTaskPage() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-x-0 h-screen max-h-screen animate-fade-in touch-pan-y overflow-hidden overscroll-none bg-gradient-to-br from-background via-background to-muted/20">
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

        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Suspense fallback={<PageLoader message="Loading form..." />}>
            <CreateTaskForm onClose={handleClose} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
