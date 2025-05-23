
import { lazy, Suspense } from "react";
import { isMockingSupabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const AuthForm = lazy(() => import("@/components/AuthForm"));
const TaskDashboard = lazy(() => import("@/features/tasks/components/TaskDashboard"));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {isMockingSupabase || user ? <TaskDashboard /> : <AuthForm />}
    </Suspense>
  );
};

export default Index;
