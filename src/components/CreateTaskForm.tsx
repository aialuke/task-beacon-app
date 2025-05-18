import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "sonner";
import { compressAndResizePhoto } from "@/lib/utils";


export default function CreateTaskForm({
  onClose,
}: {
  onClose?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [url, setUrl] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
  };


  const uploadPhoto = async (): Promise<string | null> => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
  };


  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setUrl("");
    setPhoto(null);
    setPhotoPreview(null);
    setPinned(false);
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
      </div>
      <div className="space-y-2">
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Input
          id="due_date"
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </div>
      <div className="space-y-2">
        <Input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="cursor-pointer"
        />
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
      <div className="flex justify-end space-x-2 pt-2">
        {onClose && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Creating..." : "Create Task"}
        </Button>
      </div>
    </form>
  );
}