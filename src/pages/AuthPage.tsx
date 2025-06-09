
import { ModernAuthForm } from '@/components/ui/auth';
import { AuthenticatedApp } from '@/components/layout/AuthenticatedApp';
import UnifiedErrorBoundary from '@/components/ui/UnifiedErrorBoundary';
import { TaskProviders } from '@/features/tasks/providers/TaskProviders';
import { PageLoader } from '@/components/ui/loading/UnifiedLoadingStates';
import TaskDashboard from '@/features/tasks/components/lists/TaskDashboard';

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
