
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppProviders } from './components/providers/AppProviders';
import UnifiedLoadingStates from './components/ui/loading/UnifiedLoadingStates';

// Lazy load all major pages for optimal code splitting
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const TaskDetailsPage = lazy(() => import('./pages/TaskDetailsPage'));
const CreateTaskPage = lazy(() => import('./pages/CreateTaskPage'));
const FollowUpTaskPage = lazy(() => import('./pages/FollowUpTaskPage'));

const App = () => (
  <AppProviders>
    <Suspense fallback={<UnifiedLoadingStates variant="page" message="Loading application..." />}>
      <Routes>
        <Route 
          path="/" 
          element={
            <Suspense fallback={<UnifiedLoadingStates variant="page" message="Loading dashboard..." />}>
              <AuthPage />
            </Suspense>
          } 
        />
        <Route 
          path="/create-task" 
          element={
            <Suspense fallback={<UnifiedLoadingStates variant="page" message="Loading task creation..." />}>
              <CreateTaskPage />
            </Suspense>
          } 
        />
        <Route
          path="/follow-up-task/:parentTaskId"
          element={
            <Suspense fallback={<UnifiedLoadingStates variant="page" message="Loading follow-up task..." />}>
              <FollowUpTaskPage />
            </Suspense>
          }
        />
        <Route 
          path="/tasks/:id" 
          element={
            <Suspense fallback={<UnifiedLoadingStates variant="page" message="Loading task details..." />}>
              <TaskDetailsPage />
            </Suspense>
          } 
        />
        <Route 
          path="*" 
          element={
            <Suspense fallback={<UnifiedLoadingStates variant="page" message="Loading page..." />}>
              <NotFound />
            </Suspense>
          } 
        />
      </Routes>
    </Suspense>
  </AppProviders>
);

export default App;
