// Application types for task-beacon-app

export type TaskStatus = "pending" | "complete" | "overdue";

// Represents a parent task's details fetched via Supabase relation
export interface ParentTask {
  title: string;
  description: string | null;
  photo_url: string | null;
  url_link: string | null;
}

// Represents a task in the app, aligned with Supabase schema
export interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string; // ISO date string
  photo_url: string | null;
  url_link: string | null;
  owner_id: string;
  parent_task_id: string | null;
  parent_task: ParentTask | null;
  pinned: boolean;
  status: TaskStatus;
  assignee_id: string | null;
  created_at: string;
  updated_at: string;
}

// User types (kept; verify usage in Index.tsx or auth logic)
export type UserRole = "admin" | "manager";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar_url?: string;
}