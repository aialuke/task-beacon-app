import { useState, useRef, useCallback } from 'react';

import { useErrorHandler , useSubmissionState } from '@/hooks/core';
import { AuthService } from '@/lib/api/AuthService';
import { 
  useUnifiedValidation,
  validateUnifiedSignIn,
  validateUnifiedSignUp
} from '@/lib/validation';

type AuthMode = 'signin' | 'signup';

interface UseAuthFormStateReturn {
  // Form state
  mode: AuthMode;
  email: string;
  password: string;
  name: string;
  showPassword: boolean;
  loading: boolean;
  errors: {
    email?: string;
    password?: string;
    name?: string;
  };
  
  // Refs
  nameInputRef: React.RefObject<HTMLInputElement>;
  emailInputRef: React.RefObject<HTMLInputElement>;
  
  // Actions
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setName: (value: string) => void;
  setShowPassword: (value: boolean) => void;
  toggleMode: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleEmailChange: (value: string) => void;
  handlePasswordChange: (value: string) => void;
  handleNameChange: (value: string) => void;
}

/**
 * Simplified auth form state hook - Phase 2.4 Revised
 * 
 * Using standard React hooks instead of custom performance abstractions
 */
export function useAuthFormState(): UseAuthFormStateReturn {
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
  const { isSubmitting, startSubmitting, stopSubmitting } = useSubmissionState();
  const { validateEmail: validateEmailUnified, validatePassword: validatePasswordUnified, validateUserName } = useUnifiedValidation();

  // Using unified validation functions
  const validateEmail = useCallback((value: string) => {
    if (!value) return 'Email is required';
    const result = validateEmailUnified(value);
    return result.isValid ? '' : result.errors[0] || 'Invalid email';
  }, [validateEmailUnified]);

  const validatePassword = useCallback((value: string) => {
    if (!value) return 'Password is required';
    const result = validatePasswordUnified(value);
    return result.isValid ? '' : result.errors[0] || 'Invalid password';
  }, [validatePasswordUnified]);

  const validateName = useCallback((value: string) => {
    if (!value) return 'Name is required';
    const result = validateUserName(value);
    return result.isValid ? '' : result.errors[0] || 'Invalid name';
  }, [validateUserName]);

  const validateForm = useCallback(() => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const nameError = mode === 'signup' ? validateName(name) : '';

    setErrors({
      email: emailError,
      password: passwordError,
      name: nameError
    });

    return !emailError && !passwordError && !nameError;
  }, [email, password, name, mode, validateEmail, validatePassword, validateName]);

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

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
    if (errors.email) {
      const error = validateEmail(value);
      setErrors(prev => ({ ...prev, email: error }));
    }
  }, [errors.email, validateEmail]);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
    if (errors.password) {
      const error = validatePassword(value);
      setErrors(prev => ({ ...prev, password: error }));
    }
  }, [errors.password, validatePassword]);

  const handleNameChange = useCallback((value: string) => {
    setName(value);
    if (errors.name) {
      const error = validateName(value);
      setErrors(prev => ({ ...prev, name: error }));
    }
  }, [errors.name, validateName]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    startSubmitting();
    try {
      // Clean up existing state before any auth operation
      cleanupAuthState();

      // Attempt global sign out first using AuthService
      try {
        await AuthService.signOut();
      } catch (_err) {
        // Pre-auth cleanup failed, continue with sign-in
      }

      if (mode === 'signin') {
        // Validate with unified schema
        const validationResult = validateUnifiedSignIn({ email, password });
        if (!validationResult.isValid) {
          throw new Error('Invalid sign-in data');
        }

        const response = await AuthService.signIn(email, password);
        if (!response.success) {
          const errorMessage = response.error?.message || 'Sign in failed';
          throw new Error(errorMessage);
        }
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        // Validate with unified schema
        const validationResult = validateUnifiedSignUp({ email, password, name });
        if (!validationResult.isValid) {
          throw new Error('Invalid sign-up data');
        }

        const response = await AuthService.signUp(email, password, {
          data: {
            full_name: name,
            name: name
          }
        });
        if (!response.success) {
          const errorMessage = response.error?.message || 'Sign up failed';
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
        if (errorMessage.includes('Invalid login credentials') || errorMessage.includes('invalid_credentials')) {
          setErrors({ email: 'Invalid email or password. Please try again.' });
        } else if (errorMessage.includes('User already registered') || errorMessage.includes('already_registered')) {
          setErrors({ email: 'An account with this email already exists. Try signing in instead.' });
        } else if (errorMessage.includes('Email not confirmed') || errorMessage.includes('email_not_confirmed')) {
          setErrors({ email: 'Please check your email and confirm your account before signing in.' });
        } else if (errorMessage.includes('Signup not allowed') || errorMessage.includes('signup_disabled')) {
          setErrors({ email: 'Account creation is currently disabled. Please contact support.' });
        } else if (errorMessage.includes('Password should be at least')) {
          setErrors({ password: 'Password does not meet the minimum requirements.' });
        } else if (errorMessage.includes('Unable to validate email address')) {
          setErrors({ email: 'Please enter a valid email address.' });
        } else {
          setErrors({ email: errorMessage || 'An authentication error occurred' });
        }
      } else {
        setErrors({ email: 'An unexpected error occurred' });
      }
    } finally {
      stopSubmitting();
    }
  }, [mode, email, password, name, handleError, validateForm, cleanupAuthState, startSubmitting, stopSubmitting]);

  const toggleMode = useCallback(() => {
    setMode(prevMode => prevMode === 'signin' ? 'signup' : 'signin');
    setErrors({});
    setEmail('');
    setPassword('');
    setName('');
    setShowPassword(false);
  }, []);

  return {
    mode,
    email,
    password,
    name,
    showPassword,
    loading: isSubmitting,
    errors,
    nameInputRef,
    emailInputRef,
    setEmail,
    setPassword,
    setName,
    setShowPassword,
    toggleMode,
    handleSubmit,
    handleEmailChange,
    handlePasswordChange,
    handleNameChange,
  };
}

// Export alias for backward compatibility
export const useAuthForm = useAuthFormState;
