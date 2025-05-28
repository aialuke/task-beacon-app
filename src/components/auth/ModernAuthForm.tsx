import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FloatingInput } from './FloatingInput';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { supabase, isMockingSupabase } from '@/integrations/supabase/client';
import { toast } from '@/lib/toast';
import { isValidEmail } from '@/lib/utils/validation';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { AuthError } from '@supabase/supabase-js';

type AuthMode = 'signin' | 'signup';

const ModernAuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateEmail = (value: string) => {
    if (!value) return 'Email is required';
    if (!isValidEmail(value)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email) {
      const error = validateEmail(value);
      setErrors(prev => ({ ...prev, email: error }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password) {
      const error = validatePassword(value);
      setErrors(prev => ({ ...prev, password: error }));
    }
  };

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    setErrors({
      email: emailError,
      password: passwordError,
    });

    return !emailError && !passwordError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before continuing');
      return;
    }

    setLoading(true);

    try {
      if (isMockingSupabase) {
        toast.success('Using mock authentication');
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
        return;
      }

      const { error } = mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;

      toast.success(
        mode === 'signin' 
          ? 'Welcome back! Redirecting to your dashboard...' 
          : 'Account created! Check your email for verification.'
      );

      setTimeout(() => {
        window.location.href = '/';
      }, 1500);

    } catch (error: unknown) {
      if (error instanceof AuthError) {
        toast.error(error.message || 'An unexpected error occurred');
      } else if (error instanceof Error) {
        toast.error(error.message || 'An unexpected error occurred');
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img 
              src="/assets/hourglass_logo.svg" 
              alt="Flow State Logo" 
              className="w-8 h-8"
            />
            <h1 className="text-xl font-bold text-gradient-primary">
              Flow State
            </h1>
          </div>
        </div>

        {/* Glass Morphism Card */}
        <Card className="bg-background/40 backdrop-blur-xl border-border/50 shadow-xl animate-scale-in">
          <CardHeader className="text-center pb-4">
            <h2 className="text-2xl font-semibold">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h2>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <FloatingInput
                id="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={handleEmailChange}
                error={errors.email}
                autoComplete="email"
                disabled={loading}
                required
              />

              {/* Password Input */}
              <div className="relative">
                <FloatingInput
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  error={errors.password}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  disabled={loading}
                  required
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator for Signup */}
              {mode === 'signup' && (
                <PasswordStrengthIndicator 
                  password={password} 
                  show={password.length > 0} 
                />
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className={cn(
                  "w-full h-12 text-base font-medium transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-lg",
                  loading && "cursor-not-allowed"
                )}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                    </span>
                  </div>
                ) : (
                  mode === 'signin' ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>

            {/* Mode Toggle */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {mode === 'signin' 
                  ? "Don't have an account? " 
                  : "Already have an account? "}
                <button
                  onClick={toggleMode}
                  className="text-primary hover:underline font-medium transition-colors"
                  disabled={loading}
                >
                  {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModernAuthForm;