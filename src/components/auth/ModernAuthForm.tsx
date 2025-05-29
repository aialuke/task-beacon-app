import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

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

  const validateName = (value: string) => {
    if (!value) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
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

  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name) {
      const error = validateName(value);
      setErrors(prev => ({ ...prev, name: error }));
    }
  };

  const validateForm = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const nameError = mode === 'signup' ? validateName(name) : '';

    setErrors({
      email: emailError,
      password: passwordError,
      name: nameError,
    });

    return !emailError && !passwordError && !nameError;
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

      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Welcome back! Redirecting to your dashboard...');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success('Account created! Check your email for verification.');
      }

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
    setMode(prevMode => (prevMode === 'signin' ? 'signup' : 'signin'));
    setErrors({});
    setEmail('');
    setPassword('');
    setName('');
    setShowPassword(false);
  };

  // Focus the first input field when mode changes
  useEffect(() => {
    if (mode === 'signup' && nameInputRef.current) {
      nameInputRef.current.focus();
    } else if (mode === 'signin' && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [mode]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-2">
      <div className="w-full max-w-sm">
        {/* Logo and Branding */}
        <div className="mb-4 animate-fade-in text-center">
          <div className="mb-1 flex items-center justify-center gap-2">
            <img
              src="/assets/hourglass_logo.svg"
              alt="Flow State Logo"
              className="h-10 w-10"
            />
            <h1 className="text-gradient-primary text-[26.19px] font-normal tracking-[0.02662em]">
              {' '}
              {/* Updated font size to 26.19px, tracking to 0.02662em */}
              Flow State
            </h1>
          </div>
        </div>

        {/* Card */}
        <Card className="animate-fade-in border-none bg-background">
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input (only for signup) */}
              {mode === 'signup' && (
                <FloatingInput
                  id="name"
                  label="Name"
                  type="text"
                  value={name}
                  onChange={handleNameChange}
                  error={errors.name}
                  autoComplete="name"
                  disabled={loading}
                  required
                  className="h-10 text-sm"
                  ref={nameInputRef}
                />
              )}

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
                className="h-10 text-sm"
                ref={emailInputRef}
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
                  autoComplete={
                    mode === 'signin' ? 'current-password' : 'new-password'
                  }
                  disabled={loading}
                  required
                  className="h-10 text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary"
                  disabled={loading}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
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
                  'h-10 w-full text-sm font-medium transition-all duration-300',
                  'hover:scale-[1.02] hover:shadow-lg',
                  loading && 'cursor-not-allowed'
                )}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>
                      {mode === 'signin'
                        ? 'Signing in...'
                        : 'Creating account...'}
                    </span>
                  </div>
                ) : mode === 'signin' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Mode Toggle */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                {mode === 'signin'
                  ? "Don't have an account? "
                  : 'Already have an account? '}
                <button
                  onClick={toggleMode}
                  className="font-medium text-primary transition-colors hover:underline"
                  disabled={loading}
                  aria-label={
                    mode === 'signin'
                      ? 'Switch to sign up'
                      : 'Switch to sign in'
                  }
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
