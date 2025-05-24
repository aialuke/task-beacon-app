
import { useState, useCallback } from "react";
import { useTaskFormValidation } from "./useTaskFormValidation";
import { usePhotoUpload } from "./usePhotoUpload";

export interface BaseTaskFormState {
  title: string;
  description: string;
  dueDate: string;
  url: string;
  pinned: boolean;
  assigneeId: string;
  loading: boolean;
}

export interface UseBaseTaskFormComposedOptions {
  initialUrl?: string;
  onClose?: () => void;
  maxTitleLength?: number;
}

/**
 * Composed base hook for task form functionality
 * 
 * Combines validation and photo upload functionality with basic form state management.
 * This hook composes smaller, focused hooks to provide a complete form solution.
 * 
 * @param options - Configuration options
 * @returns Complete form state and handlers
 */
export function useBaseTaskFormComposed({ 
  initialUrl = "", 
  onClose,
  maxTitleLength = 22 
}: UseBaseTaskFormComposedOptions = {}) {
  // Basic form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [url, setUrl] = useState(initialUrl);
  const [pinned, setPinned] = useState(false);
  const [assigneeId, setAssigneeId] = useState("");
  const [loading, setLoading] = useState(false);

  // Composed functionality
  const validation = useTaskFormValidation({ maxTitleLength });
  const photoUpload = usePhotoUpload();

  /**
   * Custom title setter with validation
   */
  const handleTitleChange = useCallback((value: string) => {
    // Limit to max characters
    if (value.length <= maxTitleLength) {
      setTitle(value);
    }
  }, [maxTitleLength]);

  /**
   * Validates the entire form
   */
  const validateEntireForm = useCallback((): boolean => {
    return validation.validateForm({
      title,
      url,
      dueDate
    });
  }, [validation, title, url, dueDate]);

  /**
   * Resets all form fields to their initial values
   */
  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setUrl(initialUrl);
    setPinned(false);
    setAssigneeId("");
    photoUpload.resetPhotoState();
    validation.clearValidationErrors();
    if (onClose) onClose();
  }, [initialUrl, onClose, photoUpload, validation]);

  return {
    // Basic form state
    title,
    setTitle: handleTitleChange,
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
    loading,
    setLoading,
    
    // Composed functionality
    ...photoUpload,
    ...validation,
    
    // Form operations
    validateEntireForm,
    resetForm
  };
}
