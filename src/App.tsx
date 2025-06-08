
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
        <Route path="/" element={<AuthPage />} />
        <Route path="/create-task" element={<CreateTaskPage />} />
        <Route path="/follow-up-task/:parentTaskId" element={<FollowUpTaskPage />} />
        <Route path="/tasks/:id" element={<TaskDetailsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </AppProviders>
);

export default App;
// CodeRabbit review
