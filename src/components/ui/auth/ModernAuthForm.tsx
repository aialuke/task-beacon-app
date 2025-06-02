import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FloatingInput } from './FloatingInput';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { AuthService } from '@/lib/api';
import { toast } from '@/lib/toast';
import { isValidEmail } from '@/lib/utils/validation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

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

  // Clean up auth state utility
  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

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
      setErrors((prev) => ({ ...prev, email: error }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (errors.password) {
      const error = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: error }));
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name) {
      const error = validateName(value);
      setErrors((prev) => ({ ...prev, name: error }));
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
      // Clean up existing state before any auth operation
      cleanupAuthState();

      // Attempt global sign out first using AuthService
      try {
        await AuthService.signOut();
      } catch (err) {
        console.warn('Pre-auth cleanup sign out failed, continuing:', err);
      }

      if (mode === 'signin') {
        const response = await AuthService.signIn(email, password);

        if (!response.success) {
          throw new Error(response.error?.message || 'Sign in failed');
        }

        if (response.data?.user) {
          toast.success('Welcome back! Redirecting to your dashboard...');
          // Force page reload for clean state
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        }
      } else {
        const response = await AuthService.signUp(email, password, {
          data: {
            full_name: name,
            name: name,
          },
        });

        if (!response.success) {
          throw new Error(response.error?.message || 'Sign up failed');
        }

        if (response.data?.user) {
          if (response.data.emailConfirmed) {
            toast.success('Account created successfully! Redirecting...');
            setTimeout(() => {
              window.location.href = '/';
            }, 1500);
          } else {
            toast.success(
              'Account created! Please check your email for verification.'
            );
          }
        }
      }
    } catch (error: unknown) {
      console.error('Auth error:', error);

      if (error instanceof Error) {
        // Handle specific auth errors based on message content
        const errorMessage = error.message;
        
        if (errorMessage.includes('Invalid login credentials') || errorMessage.includes('invalid_credentials')) {
          toast.error('Invalid email or password. Please try again.');
        } else if (errorMessage.includes('User already registered') || errorMessage.includes('already_registered')) {
          toast.error(
            'An account with this email already exists. Try signing in instead.'
          );
        } else if (errorMessage.includes('Email not confirmed') || errorMessage.includes('email_not_confirmed')) {
          toast.error(
            'Please check your email and confirm your account before signing in.'
          );
        } else if (errorMessage.includes('Signup not allowed') || errorMessage.includes('signup_disabled')) {
          toast.error('Account creation is currently disabled. Please contact support.');
        } else if (errorMessage.includes('Password should be at least')) {
          toast.error('Password does not meet the minimum requirements.');
        } else if (errorMessage.includes('Unable to validate email address')) {
          toast.error('Please enter a valid email address.');
        } else {
          toast.error(errorMessage || 'An authentication error occurred');
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'signin' ? 'signup' : 'signin'));
    setErrors({});
    setEmail('');
    setPassword('');
    setName('');
    setShowPassword(false);
  };

  useEffect(() => {
    const focusFirstInput = () => {
      if (mode === 'signup' && nameInputRef.current) {
        nameInputRef.current.focus();
      } else if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
    };

    const timer = setTimeout(focusFirstInput, 100);
    return () => clearTimeout(timer);
  }, [mode]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md border-0 bg-white/80 shadow-2xl backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-sm text-gray-600">
              {mode === 'signin'
                ? 'Sign in to your account to continue'
                : 'Sign up to get started with our platform'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <FloatingInput
                ref={nameInputRef}
                id="name"
                type="text"
                label="Full Name"
                value={name}
                onChange={handleNameChange}
                error={errors.name}
                disabled={loading}
                autoComplete="name"
              />
            )}

            <FloatingInput
              ref={emailInputRef}
              id="email"
              type="email"
              label="Email Address"
              value={email}
              onChange={handleEmailChange}
              error={errors.email}
              disabled={loading}
              autoComplete={mode === 'signin' ? 'username' : 'email'}
            />

            <div className="relative">
              <FloatingInput
                id="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={handlePasswordChange}
                error={errors.password}
                disabled={loading}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                disabled={loading}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {mode === 'signup' && password && (
              <PasswordStrengthIndicator password={password} show={password.length > 0} />
            )}

            <Button
              type="submit"
              className="h-12 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:from-gray-400 disabled:to-gray-500"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                  </span>
                </div>
              ) : (
                <span>
                  {mode === 'signin' ? 'Sign in' : 'Create account'}
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'signin'
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                type="button"
                onClick={toggleMode}
                className="font-medium text-blue-600 transition-colors hover:text-blue-500 focus:outline-none focus:underline"
                disabled={loading}
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernAuthForm;
