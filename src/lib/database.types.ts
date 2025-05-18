// Supabase database types for task-beacon-app
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name?: string;
          avatar_url?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          due_date: string;
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
    };
  };
}