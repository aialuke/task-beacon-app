
import { lazy, Suspense } from 'react';
import { ModernAuthForm } from '@/components/ui/auth';
import { AuthenticatedApp } from '@/components/layout/AuthenticatedApp';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageLoader } from '@/components/ui/layout/PageLoader';

// Lazy load the TaskDashboard component for code splitting
const TaskDashboard = lazy(() => 
  import('@/features/tasks/components/TaskDashboard').then(module => ({
    default: module.default
  }))
);

const AuthPage = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader variant="dashboard" message="Loading task dashboard..." />}>
        <AuthenticatedApp
          loadingComponent={<PageLoader variant="dashboard" message="Checking authentication..." />}
          authenticatedComponent={<TaskDashboard />}
          unauthenticatedFallback={<ModernAuthForm />}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default AuthPage;
