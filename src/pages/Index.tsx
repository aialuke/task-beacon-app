import { lazy, Suspense } from 'react';
import { isMockingSupabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const TaskDashboard = lazy(
  () => import('@/features/tasks/components/TaskDashboard')
);

const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is not authenticated, redirect to auth page
  if (!isMockingSupabase && !user) {
    window.location.href = '/auth';
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TaskDashboard />
    </Suspense>
  );
};

export default Index;
