
import { lazy, Suspense } from 'react';
import { ModernAuthForm } from '@/components/ui/auth';
import { AuthenticatedApp } from '@/components/layout/AuthenticatedApp';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import UnifiedLoadingStates from '@/components/ui/loading/UnifiedLoadingStates';

// Lazy load the TaskDashboard component for code splitting
const TaskDashboard = lazy(() => 
  import('@/features/tasks/components/TaskDashboard').then(module => ({
    default: module.default
  }))
);

const AuthPage = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<UnifiedLoadingStates variant="page" message="Loading task dashboard..." />}>
        <AuthenticatedApp
          loadingComponent={<UnifiedLoadingStates variant="page" message="Checking authentication..." />}
          authenticatedComponent={<TaskDashboard />}
          unauthenticatedFallback={<ModernAuthForm />}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default AuthPage;
