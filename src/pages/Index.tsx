import { lazy, Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthenticatedApp } from '@/components/layout/AuthenticatedApp';

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

/**
 * Index page - Layout only
 * 
 * This page is responsible only for rendering the main app layout.
 * All authentication logic and conditional rendering has been moved
 * to the AuthenticatedApp component for better separation of concerns.
 */
export default function Index() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<TaskDashboardSkeleton />}>
        <AuthenticatedApp
          loadingComponent={<TaskDashboardSkeleton />}
          authenticatedComponent={<TaskDashboard />}
          unauthenticatedFallback={
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
          }
        />
      </Suspense>
    </ErrorBoundary>
  );
}
