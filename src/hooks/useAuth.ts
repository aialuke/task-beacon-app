// src/hooks/useAuth.ts
import { createContext, useContext } from "react";
import { AuthContextType } from "@/contexts/AuthContext"; // We'll update AuthContext.tsx to export this type

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthContext };