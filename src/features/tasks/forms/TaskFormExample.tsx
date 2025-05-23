import { useState } from "react";
import TaskFormWithValidation from "./TaskFormWithValidation";
import { CreateTaskInput } from "../schemas/taskSchema";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { compressAndResizePhoto } from "@/lib/imageUtils";
import { toast } from "@/lib/toast";

export default function TaskFormExample({ onClose }: { onClose?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreateTaskInput & { photo: File | null }) => {
    setIsSubmitting(true);
    
    try {
      let photoUrl = null;
      if (data.photo) {
        const processedFile = await compressAndResizePhoto(data.photo);
        
        if (isMockingSupabase) {
          photoUrl = URL.createObjectURL(processedFile);
        } else {
          const fileName = `${Date.now()}-${processedFile.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("task-photos")
            .upload(fileName, processedFile);
            
          if (uploadError) throw uploadError;
          
          const { data: urlData } = await supabase.storage
            .from("task-photos")
            .createSignedUrl(fileName, 86400);
            
          photoUrl = urlData?.signedUrl || null;
        }
      }

      if (isMockingSupabase) {
        // Mock success
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      await supabase
        .from("tasks")
        .insert({
          title: data.title,
          description: data.description || null,
          due_date: data.dueDate ? new Date(data.dueDate).toISOString() : null,
          photo_url: photoUrl,
          url_link: data.url || null,
          owner_id: user.id,
          assignee_id: data.assigneeId || null,
          pinned: data.pinned,
          status: "pending",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        
    } finally {
      setIsSubmitting(false);
      if (onClose) onClose();
    }
  };

  return <TaskFormWithValidation onSubmit={handleSubmit} onClose={onClose} />;
}
