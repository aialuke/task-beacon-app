
// Task form specific types
export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  url: string;
  pinned: boolean;
  assigneeId: string;
}

export interface TaskFormOptions {
  initialUrl?: string;
  onClose?: () => void;
}
