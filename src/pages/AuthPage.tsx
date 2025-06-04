
import { lazy, Suspense } from 'react';
import { ModernAuthForm } from '@/components/ui/auth';
import { AuthenticatedApp } from '@/components/layout/AuthenticatedApp';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the TaskDashboard component
const TaskDashboard = lazy(() => 
  import('@/features/tasks/components/TaskDashboard').then(module => ({
    default: module.default
  }))
);

// Loading skeleton for task dashboard
const TaskDashboardSkeleton = () => (
  <div className="space-y-6 p-6">
    {/* Header skeleton */}
    <div className="space-y-3">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>
    
    {/* Filter navbar skeleton */}
    <div className="flex gap-2">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-28" />
      <Skeleton className="h-10 w-22" />
    </div>

    {/* Task cards skeleton - constrained width to match actual cards */}
    <div className="space-y-6 max-w-4xl">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border-2 border-border/40 bg-muted/20 p-4 sm:p-5 max-w-2xl">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AuthPage = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<TaskDashboardSkeleton />}>
        <AuthenticatedApp
          loadingComponent={<TaskDashboardSkeleton />}
          authenticatedComponent={<TaskDashboard />}
          unauthenticatedFallback={<ModernAuthForm />}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default AuthPage;
