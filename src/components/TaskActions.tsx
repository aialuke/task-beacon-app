
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Task } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface TaskActionsProps {
  task: Task;
}

export default function TaskActions({ task }: TaskActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleTogglePin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ pinned: !task.pinned })
        .eq("id", task.id);

      if (error) throw error;
      toast.success(`Task ${task.pinned ? "unpinned" : "pinned"} successfully`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: task.status === "complete" ? "pending" : "complete" })
        .eq("id", task.id);

      if (error) throw error;
      toast.success(`Task marked ${task.status === "complete" ? "incomplete" : "complete"}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFollowUp = () => {
    // This would open a modal for creating a follow-up task
    toast.info("Follow-up task feature coming soon");
  };

  const handleReassign = () => {
    // This would open a modal for reassigning the task
    toast.info("Task reassignment feature coming soon");
  };

  return (
    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
      <Button 
        variant="outline" 
        size="sm" 
        className="text-xs"
        onClick={handleTogglePin}
        disabled={loading}
      >
        {task.pinned ? "Unpin" : "Pin"}
      </Button>
      <Button 
        variant={task.status === "complete" ? "outline" : "default"} 
        size="sm"
        className="text-xs"
        onClick={handleMarkComplete}
        disabled={loading}
      >
        {task.status === "complete" ? "Mark Incomplete" : "Complete"}
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="text-xs"
        onClick={handleCreateFollowUp}
        disabled={loading}
      >
        Follow Up
      </Button>
      <Button 
        variant="outline" 
        size="sm"
        className="text-xs"
        onClick={handleReassign}
        disabled={loading}
      >
        Reassign
      </Button>
    </div>
  );
}
