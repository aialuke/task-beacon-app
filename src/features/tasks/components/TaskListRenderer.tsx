
import { lazy, Suspense } from "react";
import { Task } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const TaskCard = lazy(() => import("./TaskCard"));

interface TaskListRendererProps {
  filteredTasks: Task[];
  isLoading: boolean;
  pageSize: number;
}

// Skeleton component for lazy-loaded task cards
const TaskCardSkeleton = () => (
  <div className="animate-pulse p-4 sm:p-5 rounded-xl bg-muted/20 border-2 border-border/40">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  </div>
);

export default function TaskListRenderer({ filteredTasks, isLoading, pageSize }: TaskListRendererProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: pageSize }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-border/60 rounded-xl bg-muted/20">
        <p className="text-muted-foreground">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filteredTasks.map((task) => (
        <Suspense key={task.id} fallback={<TaskCardSkeleton />}>
          <TaskCard task={task} />
        </Suspense>
      ))}
    </div>
  );
}
