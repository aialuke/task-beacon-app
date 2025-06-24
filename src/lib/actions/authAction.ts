/**
 * Auth Action for React 19 useActionState
 *
 * Replaces the 346-line useAuthForm hook with server-side form handling,
 * leveraging React 19's useActionState for built-in pending states and validation.
 */

import { signIn, signUp } from '@/lib/api/auth';
import { signInSchema, signUpSchema } from '@/lib/validation/schemas';

// Simple error message utility
function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  return 'Unknown error occurred';
}

export interface AuthState {
  success: boolean;
  errors: {
    email?: string[];
    password?: string[];
    name?: string[];
    confirmPassword?: string[];
    form?: string[];
  };
  data: any;
}

export async function authAction(
  prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const mode = formData.get('mode') as 'signin' | 'signup';

  // Validation
  const schema = mode === 'signin' ? signInSchema : signUpSchema;
  const validationData =
    mode === 'signup'
      ? { email, password, confirmPassword, name }
      : { email, password };

  const validation = schema.safeParse(validationData);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors as any,
      data: null,
    };
  }

  try {
    const result =
      mode === 'signin'
        ? await signIn(email, password)
        : await signUp(email, password, { data: { full_name: name, name } });

    if (!result.success) {
      return {
        success: false,
        errors: { form: [result.error?.message ?? 'Authentication failed'] },
        data: null,
      };
    }

    // For React Router, we'll return success and let the component handle navigation
    return {
      success: true,
      errors: {},
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      errors: { form: [getErrorMessage(error)] },
      data: null,
    };
  }
}
