
// Define our application types
export type UserRole = "admin" | "manager";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar_url?: string;
}

export type TaskStatus = "pending" | "complete" | "overdue";

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date: string; // ISO date string
  photo_url?: string;
  url_link?: string;
  owner_id: string;
  parent_task_id?: string;
  pinned: boolean;
  status: TaskStatus;
  assignee_id?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskWithParentDetails extends Task {
  parent_task?: {
    title: string;
    description?: string;
    photo_url?: string;
    url_link?: string;
  };
}
