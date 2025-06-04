
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

    {/* Task cards skeleton - single column layout matching actual TaskList */}
    <div className="space-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border-2 border-border/40 bg-muted/20 p-4 sm:p-5">
          <div className="flex w-full items-center gap-2 mb-4">
            {/* Task status indicator */}
            <Skeleton className="h-6 w-6 rounded-full" />
            
            {/* Task title */}
            <Skeleton className="h-6 flex-1" />
            
            {/* Pin and expand buttons */}
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          
          {/* Task content area */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2 mt-3">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
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
