
import { useState, useCallback } from "react";
import { Task } from "@/lib/types";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "@/lib/toast";
import { compressAndResizePhoto } from "@/lib/utils";
import { showBrowserNotification, triggerHapticFeedback } from "@/lib/notification";

interface UseFollowUpTaskProps {
  parentTask: Task;
  onClose?: () => void;
}

export function useFollowUpTask({ parentTask, onClose }: UseFollowUpTaskProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [url, setUrl] = useState(parentTask.url_link || "");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [assigneeId, setAssigneeId] = useState<string>("");
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
    } catch (error) {
      toast.error("Error processing image");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadPhoto = useCallback(async (): Promise<string | null> => {
    if (!photo) return null;

    if (isMockingSupabase) {
      return photoPreview;
    }

    const fileName = `${Date.now()}-${photo.name}`;
    const { data, error } = await supabase.storage
      .from("task-photos")
      .upload(fileName, photo);

    if (error) {
      throw error;
    }

    const { data: urlData } = await supabase.storage
      .from("task-photos")
      .createSignedUrl(fileName, 86400);

    return urlData?.signedUrl || null;
  }, [photo, photoPreview]);

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setUrl(parentTask.url_link || "");
    setPhoto(null);
    setPhotoPreview(null);
    setPinned(false);
    setAssigneeId("");
  }, [parentTask.url_link]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl = null;
      if (photo) {
        photoUrl = await uploadPhoto();
      }

      if (isMockingSupabase) {
        toast.success("Follow-up task created successfully (mock data)");
        triggerHapticFeedback();
        if (assigneeId) {
          showBrowserNotification(
            "Task Assigned",
            `Follow-up task "${title}" has been assigned`
          );
        }
        resetForm();
        if (onClose) onClose();
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
          parent_task_id: parentTask.id,
          pinned,
          assignee_id: assigneeId || null,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;

      triggerHapticFeedback();
      toast.success("Follow-up task created successfully");

      if (assigneeId) {
        showBrowserNotification(
          "Task Assigned",
          `Follow-up task "${title}" has been assigned`
        );
      }

      resetForm();
      if (onClose) onClose();
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
    photo,
    title,
    description,
    dueDate,
    url,
    pinned,
    assigneeId,
    parentTask.id,
    uploadPhoto,
    resetForm,
    onClose,
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
    assigneeId,
    setAssigneeId,
    loading,
    handlePhotoChange,
    handleSubmit
  };
}
