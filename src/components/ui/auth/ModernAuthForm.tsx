import React, { useEffect, useState, useRef, useCallback } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { useErrorHandler } from '@/hooks/core';
import { AuthService } from '@/lib/api/AuthService';
import {
  signInSchema,
  signUpSchema,
} from '@/lib/validation/schemas';

import { AuthFormFields } from './components/AuthFormFields';
import { AuthFormHeader } from './components/AuthFormHeader';
import { AuthModeToggle } from './components/AuthModeToggle';
import { AuthSubmitButton } from './components/AuthSubmitButton';

type AuthMode = 'signin' | 'signup';

interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return typeof error === 'object' && error !== null && 'message' in error;
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (isErrorWithMessage(error)) return error.message;
  return 'Unknown error';
}

const ModernAuthForm: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const { handleError } = useErrorHandler({ showToast: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Using unified validation functions
  const validateEmail = useCallback(
    (value: string) => {
      if (!value) return 'Email is required';
      const result = signInSchema.shape.email.safeParse(value);
      return result.success ? '' : result.error.issues[0].message || 'Invalid email';
    },
    []
  );

  const validatePassword = useCallback(
    (value: string) => {
      if (!value) return 'Password is required';
      const result = signInSchema.shape.password.safeParse(value);
      return result.success ? '' : result.error.issues[0].message || 'Invalid password';
    },
    []
  );

  const validateName = useCallback(
    (value: string) => {
      if (!value) return 'Name is required';
      const result = signUpSchema._def.schema.shape.name.safeParse(value);
      return result.success ? '' : result.error.issues[0].message || 'Invalid name';
    },
    []
  );

  const validateForm = useCallback(() => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const nameError = mode === 'signup' ? validateName(name) : '';

    setErrors({
      email: emailError,
      password: passwordError,
      name: nameError,
    });

    return !emailError && !passwordError && !nameError;
  }, [
    email,
    password,
    name,
    mode,
    validateEmail,
    validatePassword,
    validateName,
  ]);

  // Clean up auth state utility
  const cleanupAuthState = useCallback(() => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  }, []);

  const handleEmailChange = useCallback(
    (value: string) => {
      setEmail(value);
      if (errors.email) {
        const error = validateEmail(value);
        setErrors(prev => ({ ...prev, email: error }));
      }
    },
    [errors.email, validateEmail]
  );

  const handlePasswordChange = useCallback(
    (value: string) => {
      setPassword(value);
      if (errors.password) {
        const error = validatePassword(value);
        setErrors(prev => ({ ...prev, password: error }));
      }
    },
    [errors.password, validatePassword]
  );

  const handleNameChange = useCallback(
    (value: string) => {
      setName(value);
      if (errors.name) {
        const error = validateName(value);
        setErrors(prev => ({ ...prev, name: error }));
      }
    },
    [errors.name, validateName]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      try {
        // Clean up existing state before any auth operation
        cleanupAuthState();

        // Attempt global sign out first using AuthService
        try {
          await AuthService.signOut();
        } catch {
          // Pre-auth cleanup failed, continue with sign-in
        }

        if (mode === 'signin') {
          // Validate with unified schema
          const validationResult = signInSchema.safeParse({ email, password });
          if (!validationResult.success) {
            throw new Error('Invalid sign-in data');
          }

          const response = await AuthService.signIn(email, password);
          if (!response.success) {
            const errorMessage =
              getErrorMessage(response.error) || 'Sign in failed';
            throw new Error(errorMessage);
          }
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        } else {
          // Validate with unified schema
          const validationResult = signUpSchema.safeParse({
            email,
            password,
            name,
          });
          if (!validationResult.success) {
            throw new Error('Invalid sign-up data');
          }

          const response = await AuthService.signUp(email, password, {
            data: {
              full_name: name,
              name: name,
            },
          });
          if (!response.success) {
            const errorMessage =
              getErrorMessage(response.error) || 'Sign up failed';
            throw new Error(errorMessage);
          }
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        }
      } catch (error: unknown) {
        handleError(error, 'Authentication');

        if (error instanceof Error) {
          const errorMessage = error.message;
          if (
            errorMessage.includes('Invalid login credentials') ||
            errorMessage.includes('invalid_credentials')
          ) {
            setErrors({ password: 'Invalid email or password' });
          } else if (errorMessage.includes('already in use')) {
            setErrors({ email: 'Email address is already in use' });
          } else {
            setErrors({ email: 'An unexpected error occurred' });
          }
        } else {
          setErrors({ password: 'An unknown error occurred' });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      mode,
      email,
      password,
      name,
      validateForm,
      handleError,
      cleanupAuthState,
    ]
  );

  const toggleMode = useCallback(() => {
    setMode(prevMode => (prevMode === 'signin' ? 'signup' : 'signin'));
    setEmail('');
    setPassword('');
    setName('');
    setErrors({});
  }, []);

  useEffect(() => {
    const focusFirstInput = () => {
      if (mode === 'signup' && nameInputRef.current) {
        nameInputRef.current.focus();
      } else if (emailInputRef.current) {
        emailInputRef.current.focus();
      }
    };
    const timer = setTimeout(focusFirstInput, 100);
    return () => {
      clearTimeout(timer);
    };
  }, [mode, nameInputRef, emailInputRef]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md rounded-xl border shadow-2xl backdrop-blur-sm">
        <CardContent className="p-8">
          <AuthFormHeader />

          <form onSubmit={handleSubmit} className="space-y-6">
            <AuthFormFields
              mode={mode}
              name={name}
              email={email}
              password={password}
              showPassword={showPassword}
              errors={errors}
              loading={isSubmitting}
              onNameChange={handleNameChange}
              onEmailChange={handleEmailChange}
              onPasswordChange={handlePasswordChange}
              onTogglePassword={handleTogglePassword}
              nameInputRef={nameInputRef}
              emailInputRef={emailInputRef}
            />

            <AuthSubmitButton mode={mode} loading={isSubmitting} />
          </form>

          <AuthModeToggle mode={mode} loading={isSubmitting} onToggle={toggleMode} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernAuthForm;
