import { supabase } from '@/integrations/supabase/client';
import { ApiError, TablesResponse } from '../types/api.types';
import { handleApiError } from '@/lib/errorHandling';

/**
 * Handles and normalizes errors from Supabase or other sources
 *
 * @param error - The error object from Supabase or other source
 * @returns A standardized ApiError object
 */
export const formatApiError = (error: unknown): ApiError => {
  // Handle PostgrestError from Supabase
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  ) {
    return {
      name: 'ApiError', // Add name property to make compatible with Error interface
      message: String(error.message),
      code: String(error.code),
      details: 'details' in error ? error.details : undefined,
      hint: 'hint' in error ? String(error.hint) : undefined,
      originalError: error as any,
    };
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      originalError: error,
    };
  }

  // Handle unknown error types
  return {
    name: 'UnknownError',
    message: typeof error === 'string' ? error : 'An unknown error occurred',
    details: error,
  };
};

/**
 * Check if a user is authenticated and get their ID
 *
 * @returns A promise resolving to the authenticated user's ID
 * @throws Error if user is not authenticated
 */
export const getCurrentUserId = async (): Promise<string> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  return user.id;
};

/**
 * Wrapper for standardized error handling in async functions
 *
 * @param requestFn - The async function to execute
 * @returns A standardized TablesResponse with data or error
 */
export const apiRequest = async <T>(
  requestFn: () => Promise<T>
): Promise<TablesResponse<T>> => {
  try {
    const data = await requestFn();
    return { data, error: null };
  } catch (error) {
    const formattedError = formatApiError(error);

    // Log error to console for debugging
    console.error('[API Error]:', formattedError);

    return { data: null, error: formattedError };
  }
};
