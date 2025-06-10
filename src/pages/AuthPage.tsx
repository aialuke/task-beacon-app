
import { AuthenticatedApp } from '@/components/layout/AuthenticatedApp';
import { ModernAuthForm } from '@/components/ui/auth';
import { PageLoader } from '@/components/ui/loading/UnifiedLoadingStates';
import { UnifiedErrorBoundary } from '@/components/ui/UnifiedErrorBoundary';
import TaskDashboard from '@/features/tasks/components/lists/TaskDashboard';
import { TaskProviders } from '@/features/tasks/providers/TaskProviders';

const AuthPage = () => {
  return (
    <UnifiedErrorBoundary variant="page">
      <AuthenticatedApp
        loadingComponent={<PageLoader message="Checking authentication..." />}
        authenticatedComponent={
          <TaskProviders>
            <TaskDashboard />
          </TaskProviders>
        }
        unauthenticatedFallback={<ModernAuthForm />}
      />
    </UnifiedErrorBoundary>
  );
};

export default AuthPage;
