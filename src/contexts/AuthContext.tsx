
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "@/lib/toast";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user data
  const fetchUser = async () => {
    try {
      if (isMockingSupabase) {
        setUser({ id: "mock-user", email: "mock@example.com" });
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ? { id: user.id, email: user.email || "" } : null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error);
        toast.error(error.message);
      } else {
        const genericError = new Error("Failed to fetch user information");
        setError(genericError);
        toast.error(genericError.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error: unknown) {
      console.error("Sign-out error:", error);
      toast.error("Failed to sign out");
    }
  };

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
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
