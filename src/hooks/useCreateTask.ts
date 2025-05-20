
import { useCallback } from "react";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "@/lib/toast";
import { useBaseTaskForm } from "./useBaseTaskForm";

interface UseCreateTaskProps {
  onClose?: () => void;
}

export function useCreateTask({ onClose }: UseCreateTaskProps = {}) {
  const {
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
    setLoading,
    handlePhotoChange,
    uploadPhoto,
    resetForm
  } = useBaseTaskForm({ onClose });

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
  }, [
    title,
    description,
    dueDate,
    url,
    photo,
    pinned,
    uploadPhoto,
    resetForm,
    setLoading
  ]);

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
