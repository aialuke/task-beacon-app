/**
 * Auth Form Hook
 *
 * Extracted business logic from ModernAuthForm.tsx to create a reusable,
 * testable hook that manages all authentication state and operations.
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { signIn, signUp, signOut } from '@/lib/api/auth';
import { signInSchema, signUpSchema } from '@/lib/validation/schemas';

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

interface AuthFormState {
  mode: AuthMode;
  email: string;
  password: string;
  name: string;
  showPassword: boolean;
  errors: {
    email?: string;
    password?: string;
    name?: string;
  };
  isSubmitting: boolean;
}

interface AuthFormHandlers {
  handleEmailChange: (value: string) => void;
  handlePasswordChange: (value: string) => void;
  handleNameChange: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleModeSwitch: () => void;
  handleTogglePassword: () => void;
}

interface AuthFormRefs {
  nameInputRef: React.RefObject<HTMLInputElement>;
  emailInputRef: React.RefObject<HTMLInputElement>;
}

interface UseAuthFormReturn {
  formState: AuthFormState;
  formHandlers: AuthFormHandlers;
  formRefs: AuthFormRefs;
}

/**
 * Custom hook for managing authentication form state and operations
 */
export function useAuthForm(): UseAuthFormReturn {
  const navigate = useNavigate();

  // State management
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Validation functions
  const validateEmail = useCallback((value: string) => {
    if (!value) return 'Email is required';
    const result = signInSchema.shape.email.safeParse(value);
    return result.success
      ? ''
      : result.error.issues[0].message || 'Invalid email';
  }, []);

  const validatePassword = useCallback((value: string) => {
    if (!value) return 'Password is required';
    const result = signInSchema.shape.password.safeParse(value);
    return result.success
      ? ''
      : result.error.issues[0].message || 'Invalid password';
  }, []);

  const validateName = useCallback((value: string) => {
    if (!value) return 'Name is required';
    const result = signUpSchema._def.schema.shape.name.safeParse(value);
    return result.success
      ? ''
      : result.error.issues[0].message || 'Invalid name';
  }, []);

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

  // Event handlers
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
          await signOut();
        } catch {
          // Pre-auth cleanup failed, continue with sign-in
        }

        if (mode === 'signin') {
          // Validate with unified schema
          const validationResult = signInSchema.safeParse({ email, password });
          if (!validationResult.success) {
            throw new Error('Invalid sign-in data');
          }

          const response = await signIn(email, password);
          if (!response.success) {
            const errorMessage =
              getErrorMessage(response.error) || 'Sign in failed';
            throw new Error(errorMessage);
          }
          setTimeout(() => {
            navigate('/', { replace: true });
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

          const response = await signUp(email, password, {
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
            navigate('/', { replace: true });
          }, 1500);
        }
      } catch (error: unknown) {
        // Log error and show toast
        console.error('Authentication error:', error);
        toast.error(
          'Authentication failed. Please check your credentials or try again.'
        );

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
    [mode, email, password, name, validateForm, cleanupAuthState, navigate]
  );

  const handleModeSwitch = useCallback(() => {
    setMode(prevMode => (prevMode === 'signin' ? 'signup' : 'signin'));
    setEmail('');
    setPassword('');
    setName('');
    setErrors({});
  }, []);

  const handleTogglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Focus management effect
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
  }, [mode]);

  // Return structured data
  const formState: AuthFormState = {
    mode,
    email,
    password,
    name,
    showPassword,
    errors,
    isSubmitting,
  };

  const formHandlers: AuthFormHandlers = {
    handleEmailChange,
    handlePasswordChange,
    handleNameChange,
    handleSubmit,
    handleModeSwitch,
    handleTogglePassword,
  };

  const formRefs: AuthFormRefs = {
    nameInputRef,
    emailInputRef,
  };

  return {
    formState,
    formHandlers,
    formRefs,
  };
}
