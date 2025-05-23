import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "@/lib/toast"; // Updated import

type AuthMode = "signin" | "signup" | "pin";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isMockingSupabase) {
        toast.success("Using mock authentication");
        setTimeout(() => window.location.reload(), 1000);
        return;
      }

      if (mode === "pin") {
        toast.error("PIN authentication not implemented yet");
        return;
      }

      const { error } = mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;

      toast.success(mode === "signup" ? "Check your email for a confirmation link!" : "Logged in successfully!");
        } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (mode === "pin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Card className="w-full max-w-sm mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Enter PIN</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth}>
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="h-12 text-center text-lg"
                    value={pin[i] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value && !/^\d$/.test(value)) return;

                      setPin((prev) => {
                        const newPin = prev.split("");
                        newPin[i] = value;
                        return newPin.join("");
                      });

                      if (value && i < 3) {
                        const nextInput = document.querySelectorAll("input")[i + 1] as HTMLInputElement;
                        if (nextInput) nextInput.focus();
                      }
                    }}
                  />
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <Button
                  type="submit"
                  className="btn-primary"
                  disabled={pin.length !== 4 || loading}
                >
                  {loading ? "Verifying..." : "Continue"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMode("signin")}
                  className="btn-secondary"
                >
                  Use Email Instead
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading
                ? mode === "signin"
                  ? "Signing In..."
                  : "Creating Account..."
                : mode === "signin"
                ? "Sign In"
                : "Create Account"}
            </Button>
            <div className="text-center text-sm">
              {mode === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode("pin")}
                className="text-sm text-primary hover:underline font-medium"
              >
                Use PIN Instead
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}