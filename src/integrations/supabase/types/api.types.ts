
import { Database } from '@/integrations/supabase/types';
import { PostgrestError } from '@supabase/supabase-js';

// Re-export centralized API types
export * from "@/types/api.types";

// Legacy exports for backward compatibility
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
