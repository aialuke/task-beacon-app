import { AuthenticatedApp } from '@/components/layout/AuthenticatedApp';
import { ModernAuthForm } from '@/components/ui/auth';
import UnifiedErrorBoundary from '@/components/ui/UnifiedErrorBoundary';
import TaskDashboard from '@/features/tasks/components/task-visualization/TaskDashboard';
import { TaskProviders } from '@/features/tasks/providers/TaskProviders';

// Simple loading fallback for auth checking
function AuthLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="mx-auto size-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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
