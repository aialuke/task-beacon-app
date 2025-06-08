
import { ModernAuthForm } from '@/components/ui/auth';
import { AuthenticatedApp } from '@/components/layout/AuthenticatedApp';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TaskProviders } from '@/features/tasks/providers/TaskProviders';
import UnifiedLoadingStates from '@/components/ui/loading/UnifiedLoadingStates';
import TaskDashboard from '@/features/tasks/components/TaskDashboard';

const AuthPage = () => {
  return (
    <ErrorBoundary>
      <AuthenticatedApp
        loadingComponent={<UnifiedLoadingStates variant="page" message="Checking authentication..." />}
        authenticatedComponent={
          <TaskProviders>
            <TaskDashboard />
          </TaskProviders>
        }
        unauthenticatedFallback={<ModernAuthForm />}
      />
    </ErrorBoundary>
  );
};

export default AuthPage;
// CodeRabbit review
// CodeRabbit review
