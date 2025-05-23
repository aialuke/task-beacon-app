
// Move from src/hooks/useBaseTaskForm.ts
import { useState, useCallback } from "react";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "@/lib/toast";
import { compressAndResizePhoto } from "@/lib/utils";

export interface BaseTaskFormState {
  title: string;
  description: string;
  dueDate: string;
  url: string;
  photo: File | null;
  photoPreview: string | null;
  pinned: boolean;
  assigneeId: string;
  loading: boolean;
}

export interface UseBaseTaskFormOptions {
  initialUrl?: string;
  onClose?: () => void;
}

/**
 * Base hook for task form functionality
 * 
 * Provides common state and handlers for task forms, including:
 * - Form field state management
 * - Photo upload and preview
 * - Form validation
 * - Form reset
 * 
 * @param options - Configuration options
 * @param options.initialUrl - Initial URL value for the form
 * @param options.onClose - Callback function to execute when form is closed or reset
 * @returns Form state and handlers
 */
export function useBaseTaskForm({ initialUrl = "", onClose }: UseBaseTaskFormOptions = {}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [url, setUrl] = useState(initialUrl);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [assigneeId, setAssigneeId] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Custom title setter with validation
   * Limits title to 22 characters
   */
  const handleTitleChange = useCallback((value: string) => {
    // Limit to 22 characters
    if (value.length <= 22) {
      setTitle(value);
    }
  }, []);

  /**
   * Handles photo file input changes
   * Creates a preview and processes the photo for upload
   */
  const handlePhotoChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = e.target.files?.[0];
    if (!file) {
      setLoading(false);
      return;
    }

    const preview = URL.createObjectURL(file);
    setPhotoPreview(preview);
    try {
      const processedFile = await compressAndResizePhoto(file);
      setPhoto(processedFile);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Uploads the selected photo to Supabase storage
   * @returns URL of the uploaded photo or null if no photo
   */
  const uploadPhoto = useCallback(async (): Promise<string | null> => {
    if (!photo) return null;
    if (isMockingSupabase) return photoPreview;

    const fileName = `${Date.now()}-${photo.name}`;
    const { data, error } = await supabase.storage
      .from("task-photos")
      .upload(fileName, photo);
    if (error) throw error;

    const { data: urlData } = await supabase.storage
      .from("task-photos")
      .createSignedUrl(fileName, 86400);
    return urlData?.signedUrl || null;
  }, [photo, photoPreview]);

  /**
   * Resets all form fields to their initial values
   */
  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setUrl(initialUrl);
    setPhoto(null);
    setPhotoPreview(null);
    setPinned(false);
    setAssigneeId("");
    if (onClose) onClose();
  }, [initialUrl, onClose]);

  /**
   * Validates the task title
   * @param value - The title value to validate
   * @returns True if valid, false otherwise
   */
  const validateTitle = useCallback((value: string): boolean => {
    if (value.length > 22) {
      toast.error("Task title cannot exceed 22 characters");
      return false;
    }
    return true;
  }, []);

  return {
    title,
    setTitle: handleTitleChange,
    description,
    setDescription,
    dueDate,
    setDueDate,
    url,
    setUrl,
    photo,
    photoPreview,
    pinned,
    setPinned,
    assigneeId,
    setAssigneeId,
    loading,
    setLoading,
    handlePhotoChange,
    uploadPhoto,
    resetForm,
    validateTitle
  };
}
