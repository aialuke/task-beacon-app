
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AuthPage from './pages/AuthPage';
import { AppProviders } from './components/providers/AppProviders';

// Lazy load pages for better performance
const NotFound = lazy(() => import('./pages/NotFound'));
const TaskDetailsPage = lazy(() => import('./pages/TaskDetailsPage'));
const CreateTaskPage = lazy(() => import('./pages/CreateTaskPage'));
const FollowUpTaskPage = lazy(() => import('./pages/FollowUpTaskPage'));

const App = () => (
  <AppProviders>
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
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
