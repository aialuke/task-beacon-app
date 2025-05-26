
import { useState, useCallback } from "react";

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

/**
 * Hook for managing basic form field state
 */
export function useFormState({ initialUrl = "" }: UseFormStateOptions = {}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [url, setUrl] = useState(initialUrl);
  const [pinned, setPinned] = useState(false);
  const [assigneeId, setAssigneeId] = useState("");

  const resetFormState = useCallback(() => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setUrl(initialUrl);
    setPinned(false);
    setAssigneeId("");
  }, [initialUrl]);

  return {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    url,
    setUrl,
    pinned,
    setPinned,
    assigneeId,
    setAssigneeId,
    resetFormState,
  };
}
