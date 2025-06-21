import { AuthenticatedApp } from '@/components/layout/AuthenticatedApp';
import { ModernAuthForm } from '@/components/ui/auth';
import UnifiedErrorBoundary from '@/components/ui/UnifiedErrorBoundary';
import TaskDashboard from '@/features/tasks/components/task-visualization/TaskDashboard';
import { TaskProviders } from '@/features/tasks/providers/TaskProviders';

// Simple loading fallback for auth checking
function AuthLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full size-12 border-2 border-primary border-t-transparent mx-auto" />
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    </div>
  );
}

const AuthPage = () => {
  return (
    <UnifiedErrorBoundary variant="page">
      <AuthenticatedApp
        loadingComponent={<AuthLoadingFallback />}
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
