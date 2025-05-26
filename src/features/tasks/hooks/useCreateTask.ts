
import { useCallback } from "react";
import { toast } from "@/lib/toast";
import { useNavigate } from "react-router-dom";
import { useTaskForm } from "./useTaskForm";
import { createTask, uploadTaskPhoto } from "@/integrations/supabase/api/tasks.api";
import { getCurrentUserId } from "@/integrations/supabase/api/base.api";

interface UseCreateTaskProps {
  onClose?: () => void;
}

/**
 * Custom hook for task creation functionality
 * 
 * Builds on useTaskForm to provide specialized functionality for creating new tasks
 */
export function useCreateTask({ onClose }: UseCreateTaskProps = {}) {
  const navigate = useNavigate();
  
  const taskForm = useTaskForm({ 
    onClose: onClose || (() => navigate("/"))
  });

  /**
   * Handles form submission for creating a new task
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate title length
    if (!taskForm.validateTitle(taskForm.title)) return;
    
    // Validate required fields
    if (!taskForm.title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    if (!taskForm.dueDate) {
      toast.error("Due date is required");
      return;
    }
    
    taskForm.setLoading(true);
    try {
      let photoUrl = null;
      if (taskForm.photo) {
        const { data: uploadedUrl, error: uploadError } = await uploadTaskPhoto(taskForm.photo);
        
        if (uploadError) throw uploadError;
        photoUrl = uploadedUrl;
      }

      // If no assignee is selected, assign to current user
      const currentUserId = await getCurrentUserId();
      const finalAssigneeId = taskForm.assigneeId || currentUserId;

      const { error } = await createTask({
        title: taskForm.title,
        description: taskForm.description || null,
        due_date: new Date(taskForm.dueDate).toISOString(),
        photo_url: photoUrl,
        url_link: taskForm.url || null,
        assignee_id: finalAssigneeId,
        pinned: taskForm.pinned,
      });

      if (error) throw error;
      
      toast.success("Task created successfully");
      taskForm.resetForm();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      taskForm.setLoading(false);
    }
  }, [taskForm]);

  return {
    ...taskForm,
    handleSubmit,
  };
}
