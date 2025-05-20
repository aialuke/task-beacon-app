
import { useState, useCallback } from "react";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "@/lib/toast";
import { compressAndResizePhoto } from "@/lib/utils";

interface UseCreateTaskProps {
  onClose?: () => void;
}

export function useCreateTask({ onClose }: UseCreateTaskProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [url, setUrl] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setUrl("");
    setPhoto(null);
    setPhotoPreview(null);
    setPinned(false);
    if (onClose) onClose();
  }, [onClose]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let photoUrl = null;
      if (photo) photoUrl = await uploadPhoto();

      if (isMockingSupabase) {
        toast.success("Task created successfully (mock data)");
        resetForm();
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title,
          description: description || null,
          due_date: new Date(dueDate).toISOString(),
          photo_url: photoUrl,
          url_link: url || null,
          owner_id: user.id,
          pinned,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select();
      if (error) throw error;
      toast.success("Task created successfully");

      resetForm();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, [title, description, dueDate, url, photo, pinned, uploadPhoto, resetForm]);

  return {
    title,
    setTitle,
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
    loading,
    handlePhotoChange,
    handleSubmit
  };
}
