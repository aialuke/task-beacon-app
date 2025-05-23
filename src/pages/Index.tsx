
import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { User } from "@/lib/types";
import { toast } from "@/lib/toast";

const AuthForm = lazy(() => import("@/components/AuthForm"));
const TaskDashboard = lazy(() => import("@/features/tasks/components/TaskDashboard"));

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ? { id: user.id, email: user.email || "" } : null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch user information");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isMockingSupabase) {
      setUser({ id: "mock-user", email: "mock@example.com" });
      setLoading(false);
      return;
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ? { id: session.user.id, email: session.user.email || "" } : null);
      }
    );

    // THEN check for existing session
    fetchUser();

    return () => subscription.unsubscribe();
  }, [fetchUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      }
    >
      {isMockingSupabase || user ? <TaskDashboard /> : <AuthForm />}
    </Suspense>
  );
};

export default Index;
