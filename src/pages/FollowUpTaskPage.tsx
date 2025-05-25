
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import FollowUpTaskForm from "@/features/tasks/forms/FollowUpTaskForm";
import { getTask } from "@/integrations/supabase/api/tasks.api";
import { Skeleton } from "@/components/ui/skeleton";

export default function FollowUpTaskPage() {
  const navigate = useNavigate();
  const { parentTaskId } = useParams<{ parentTaskId: string }>();

  const { data: parentTask, isLoading, error } = useQuery({
    queryKey: ['task', parentTaskId],
    queryFn: () => getTask(parentTaskId!),
    enabled: !!parentTaskId,
  });

  const handleClose = () => {
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center gap-6 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="p-3 hover:bg-accent/80 transition-all duration-200 hover:scale-105 rounded-full shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="space-y-2">
              <Skeleton className="h-8 w-64 rounded-lg" />
              <Skeleton className="h-4 w-48 rounded-md" />
            </div>
          </div>
          <div className="space-y-6 bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-lg">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !parentTask) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center gap-6 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="p-3 hover:bg-accent/80 transition-all duration-200 hover:scale-105 rounded-full shadow-sm hover:shadow-md"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Follow-up Task</h1>
              <p className="text-muted-foreground text-sm">Create a follow-up task</p>
            </div>
          </div>
          <div className="text-center py-12 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-lg">
            <div className="space-y-4">
              <p className="text-muted-foreground text-lg">Task not found or error loading task.</p>
              <Button onClick={() => navigate("/")} className="mt-6 px-6 py-2 rounded-full">
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 animate-fade-in">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-6 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="p-3 hover:bg-accent/80 transition-all duration-200 hover:scale-105 rounded-full shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Create Follow-up Task</h1>
            <p className="text-muted-foreground text-sm">Continue from your previous task</p>
          </div>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <FollowUpTaskForm parentTask={parentTask} onClose={handleClose} />
        </div>
      </div>
    </div>
  );
}
