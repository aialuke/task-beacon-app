import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "@/lib/toast";
import { compressAndResizePhoto } from "@/lib/utils";
import { Task } from "@/lib/types";
import { showBrowserNotification, triggerHapticFeedback } from "@/lib/notification";
import UserSelect from "./UserSelect";
import { Calendar } from "lucide-react";

interface FollowUpTaskFormProps {
  parentTask: Task;
  onClose?: () => void;
}

export default function FollowUpTaskForm({ parentTask, onClose }: FollowUpTaskFormProps) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-2 bg-gray-50 rounded-md">
        <h4 className="font-medium text-sm">Following up on: {parentTask.title}</h4>
      </div>

      <div className="space-y-2">
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
          className="text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          rows={3}
          className="text-foreground"
        />
      </div>

      <div className="space-y-2">
        <div className="relative">
          <Input
            id="due_date"
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Select due date"
            className="pl-9 text-foreground"
            required
          />
          <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 stroke-gray-500" />
        </div>
      </div>

      <div className="space-y-2">
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="text-foreground"
        />
      </div>

      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="cursor-pointer w-full sm:w-auto text-foreground"
            aria-label="Attach File"
          />
        </div>
        {photoPreview && (
          <div className="mt-2">
            <img
              src={photoPreview}
              alt="Preview"
              className="h-20 w-20 object-cover rounded-md"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignee" className="text-foreground">Assignee</Label>
        <UserSelect
          value={assigneeId}
          onChange={setAssigneeId}
          disabled={loading}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="text-foreground"
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Creating..." : "Create Follow-up Task"}
        </Button>
      </div>
    </form>
  );
}
