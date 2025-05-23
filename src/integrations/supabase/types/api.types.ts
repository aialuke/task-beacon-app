
import { Database } from '@/integrations/supabase/types';
import { PostgrestError } from '@supabase/supabase-js';

export type ApiResponse<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
};

export type ApiError = {
  message: string;
  code?: string;
  details?: unknown;
  hint?: string;
  originalError?: PostgrestError | Error;
};

export type TablesResponse<T> = {
  data: T | null;
  error: ApiError | null;
};

// Typed table definitions using the Database types
export type Tables = Database['public']['Tables'];
export type TaskRow = Tables['tasks']['Row'];
export type UserRow = Tables['users']['Row'];
