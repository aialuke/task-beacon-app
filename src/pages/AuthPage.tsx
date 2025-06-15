import { AuthenticatedApp } from '@/shared/components/layout/AuthenticatedApp';
import { ModernAuthForm } from '@/shared/components/ui/auth';
import { PageLoader } from '@/shared/components/ui/loading/UnifiedLoadingStates';
import UnifiedErrorBoundary from '@/shared/components/ui/UnifiedErrorBoundary';

import DashboardPage from './DashboardPage';

const AuthPage = () => {
  return (
    <UnifiedErrorBoundary variant="page">
      <AuthenticatedApp
        loadingComponent={<PageLoader message="Checking authentication..." />}
        authenticatedComponent={<DashboardPage />}
        unauthenticatedFallback={<ModernAuthForm />}
      />
    </UnifiedErrorBoundary>
  );
};

export default AuthPage;
