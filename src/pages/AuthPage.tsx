
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
