export type TaskStatus = "pending" | "complete" | "overdue";

export interface ParentTask {
  id: string; // Added id
  title: string;
  description: string | null;
  photo_url: string | null;
  url_link: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
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

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}