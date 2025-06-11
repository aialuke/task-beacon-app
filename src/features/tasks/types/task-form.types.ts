// Task form specific types
interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  url: string;
  assigneeId: string;
}

interface TaskFormOptions {
  initialUrl?: string;
  onClose?: () => void;
}
