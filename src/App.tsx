import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import { AppProviders } from './components/providers/AppProviders';

// Simple loading fallback for React 19 Enhanced Suspense
function AppLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full size-12 border-2 border-primary border-t-transparent mx-auto" />
        <p className="text-muted-foreground">Loading application...</p>
      </div>
    </div>
  );
}

// Lazy load all major pages for optimal code splitting
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const TaskDetailsPage = lazy(() => import('./pages/TaskDetailsPage'));
const CreateTaskPage = lazy(() => import('./pages/CreateTaskPage'));
const FollowUpTaskPage = lazy(() => import('./pages/FollowUpTaskPage'));

const App = () => (
  <AppProviders>
    <Suspense fallback={<AppLoadingFallback />}>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/create-task" element={<CreateTaskPage />} />
        <Route
          path="/follow-up-task/:parentTaskId"
          element={<FollowUpTaskPage />}
        />
        <Route path="/tasks/:id" element={<TaskDetailsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </AppProviders>
);

export default App;
