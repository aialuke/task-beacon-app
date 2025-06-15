import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import { PerformancePanel, usePerformancePanel } from './components/debug/PerformancePanel';
import { AppProviders } from './components/providers/AppProviders';
import { PageLoader } from './components/ui/loading/UnifiedLoadingStates';

// Lazy load all major pages for optimal code splitting
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const TaskDetailsPage = lazy(() => import('./pages/TaskDetailsPage'));
const CreateTaskPage = lazy(() => import('./pages/CreateTaskPage'));
const FollowUpTaskPage = lazy(() => import('./pages/FollowUpTaskPage'));

const App = () => {
  const { isVisible: isPerfPanelVisible, toggle: togglePerfPanel } = usePerformancePanel();

  return (
    <AppProviders>
      <Suspense fallback={<PageLoader message="Loading application..." />}>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/create-task" element={<CreateTaskPage />} />
          <Route path="/follow-up-task/:parentTaskId" element={<FollowUpTaskPage />} />
          <Route path="/tasks/:id" element={<TaskDetailsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      
      {/* Phase 3: Performance Monitoring Panel (Dev only) */}
      <PerformancePanel 
        isVisible={isPerfPanelVisible} 
        onToggle={togglePerfPanel} 
      />
    </AppProviders>
  );
};

export default App;
