
// Form-related types
export interface FormState {
  title: string;
  description: string;
  dueDate: string;
  url: string;
  pinned: boolean;
  assigneeId: string;
}

export interface UseFormStateOptions {
  initialUrl?: string;
}
