// Move from src/pages/TaskDetailsPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Task } from "@/lib/types";
import { supabase, isMockingSupabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";
import { formatDate } from "@/lib/dateUtils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar1, ExternalLink } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import { getTaskStatus } from "@/lib/uiUtils";
import TaskActions from "../components/TaskActions";
import { Skeleton } from "@/components/ui/skeleton";

const TaskDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        if (isMockingSupabase) {
          const { mockDataTasks } = await import("@/lib/mockDataTasks");
          const mockTask = mockDataTasks.find(t => t.id === id);
          if (mockTask) {
            setTask(mockTask);
            setIsPinned(mockTask.pinned);
          } else {
            toast.error("Task not found");
          }
          return;
        }

        // Use type assertion to work around empty Database type
        const { data, error } = await (supabase as any)
          .from("tasks")
          .select(`
            *,
            parent_task:parent_task_id (
              title,
              description,
              photo_url,
              url_link
            )
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setTask(data as Task);
          setIsPinned(data.pinned);
        } else {
          toast.error("Task not found");
        }
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

    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-8 space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        <div className="animate-pulse space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft size={16} className="mr-2" /> Back
        </Button>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Task not found
        </div>
      </div>
    );
  }

  const status = getTaskStatus(task);

  return (
    <div className="container py-8 max-w-2xl mx-auto">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft size={16} className="mr-2" /> Back
      </Button>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            <CountdownTimer dueDate={task.due_date} status={status} />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
            {task.description && (
              <p className="text-gray-600 mb-4">{task.description}</p>
            )}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center gap-3 mb-3">
            <Calendar1 size={18} className="text-gray-500" />
            <span>{task.due_date ? formatDate(task.due_date) : "No due date"}</span>
          </div>

          {task.url_link && (
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink size={18} className="text-primary" />
              <a
                href={task.url_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {task.url_link}
              </a>
            </div>
          )}
        </div>

        {task.photo_url && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Attachment</h3>
            <img
              src={task.photo_url}
              alt="Task attachment"
              className="max-h-60 rounded-lg object-contain bg-gray-50"
            />
          </div>
        )}

        {task.parent_task && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Follows Up On</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium">{task.parent_task.title}</h4>
              {task.parent_task.description && (
                <p className="text-gray-600 mt-2">{task.parent_task.description}</p>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-3"
                onClick={() => navigate(`/tasks/${task.parent_task_id}`)}
              >
                <ExternalLink size={14} className="mr-2" />
                View Original Task
              </Button>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <TaskActions task={{ ...task, pinned: isPinned }} detailView />
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsPage;
