
import { ModernAuthForm } from '@/components/ui/auth';
import { AuthenticatedApp } from '@/components/layout/AuthenticatedApp';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TaskProviders } from '@/features/tasks/providers/TaskProviders';
import PageLoader from '@/components/ui/loading/PageLoader';
import TaskDashboard from '@/features/tasks/components/lists/TaskDashboard';

const AuthPage = () => {
  return (
    <ErrorBoundary>
      <AuthenticatedApp
        loadingComponent={<PageLoader message="Checking authentication..." />}
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
