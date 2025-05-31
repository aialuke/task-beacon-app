
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Index from './pages/Index';
import AuthPage from './pages/AuthPage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoadingSpinner } from '@/components/ui/layout';

const NotFound = lazy(() => import('./pages/NotFound'));
const TaskDetailsPage = lazy(() => import('./pages/TaskDetailsPage'));
const CreateTaskPage = lazy(() => import('./pages/CreateTaskPage'));
const FollowUpTaskPage = lazy(() => import('./pages/FollowUpTaskPage'));
const DatabaseTestPage = lazy(() => import('./pages/DatabaseTestPage'));

// Create a client with real-time optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60, // 1 minute
      refetchOnWindowFocus: true,
      // Reduce refetch interval for better real-time experience
      refetchInterval: 30000, // 30 seconds for active queries
    },
  },
});

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/create-task" element={<CreateTaskPage />} />
                <Route
                  path="/follow-up-task/:parentTaskId"
                  element={<FollowUpTaskPage />}
                />
                <Route path="/tasks/:id" element={<TaskDetailsPage />} />
                <Route path="/database-test" element={<DatabaseTestPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
