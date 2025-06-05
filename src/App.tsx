
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AppProviders } from './components/providers/AppProviders';
import { PageLoader } from './components/ui/layout/PageLoader';

// Lazy load all major pages for optimal code splitting
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const TaskDetailsPage = lazy(() => import('./pages/TaskDetailsPage'));
const CreateTaskPage = lazy(() => import('./pages/CreateTaskPage'));
const FollowUpTaskPage = lazy(() => import('./pages/FollowUpTaskPage'));

const App = () => (
  <AppProviders>
    <Suspense fallback={<PageLoader message="Loading application..." />}>
      <Routes>
        <Route 
          path="/" 
          element={
            <Suspense fallback={<PageLoader variant="dashboard" message="Loading dashboard..." />}>
              <AuthPage />
            </Suspense>
          } 
        />
        <Route 
          path="/create-task" 
          element={
            <Suspense fallback={<PageLoader message="Loading task creation..." />}>
              <CreateTaskPage />
            </Suspense>
          } 
        />
        <Route
          path="/follow-up-task/:parentTaskId"
          element={
            <Suspense fallback={<PageLoader message="Loading follow-up task..." />}>
              <FollowUpTaskPage />
            </Suspense>
          }
        />
        <Route 
          path="/tasks/:id" 
          element={
            <Suspense fallback={<PageLoader message="Loading task details..." />}>
              <TaskDetailsPage />
            </Suspense>
          } 
        />
        <Route 
          path="*" 
          element={
            <Suspense fallback={<PageLoader variant="minimal" message="Loading page..." />}>
              <NotFound />
            </Suspense>
          } 
        />
      </Routes>
    </Suspense>
  </AppProviders>
);

export default App;
