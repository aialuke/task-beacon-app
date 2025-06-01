import { lazy, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load components with better chunking
const TaskDashboard = lazy(() => 
  import('@/features/tasks/components/TaskDashboard').then(module => ({
    default: module.default
  }))
);

// Improved loading skeleton for task dashboard
const TaskDashboardSkeleton = () => (
  <div className="space-y-6 p-6">
    <div className="space-y-3">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-lg border p-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  </div>
);

export default function Index() {
  const { user, loading } = useAuth();

  // Show loading state while auth is initializing
  if (loading) {
    return <TaskDashboardSkeleton />;
  }

  // Show task dashboard for authenticated users
  if (user) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<TaskDashboardSkeleton />}>
          <TaskDashboard />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // Redirect unauthenticated users
  return (
    <div className="flex h-96 items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Task Beacon
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Please sign in to access your tasks
        </p>
      </div>
    </div>
  );
}
