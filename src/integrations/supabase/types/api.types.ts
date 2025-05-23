
import { Database } from '@/integrations/supabase/types';
import { PostgrestError } from '@supabase/supabase-js';

export type ApiResponse<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
};

export type ApiError = {
  message: string;
  name: string; // Added name property to match Error interface
  code?: string;
  details?: unknown;
  hint?: string;
  originalError?: PostgrestError | Error;
};

export type TablesResponse<T> = {
  data: T | null;
  error: ApiError | null;
};

// We need to manually define these table types as they're not yet generated correctly
// in the Database type. In a real project, these would be generated automatically.
export type Tables = {
  tasks: {
    Row: {
      id: string;
      title: string;
      description: string | null;
      due_date: string | null;
      photo_url: string | null;
      url_link: string | null;
      owner_id: string;
      parent_task_id: string | null;
      pinned: boolean;
      status: "pending" | "complete" | "overdue";
      assignee_id: string | null;
      created_at: string;
      updated_at: string;
    };
  };
  users: {
    Row: {
      id: string;
      email: string;
      name?: string;
      avatar_url?: string;
    };
  };
};

export type TaskRow = Tables['tasks']['Row'];
export type UserRow = Tables['users']['Row'];
