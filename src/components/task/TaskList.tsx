import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Task, TaskStatus } from "@/lib/types";
import TaskCard from "./TaskCard";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "@/lib/toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ClockPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExpandedTaskProvider } from "@/contexts/ExpandedTaskContext";
import { TaskHeightProvider } from "@/contexts/TaskHeightContext";

const CreateTaskForm = lazy(() => import("../CreateTaskForm"));

interface TaskListProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

export default function TaskList({ dialogOpen, setDialogOpen }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      if (isMockingSupabase) {
        const { mockDataTasks } = await import("@/lib/mockDataTasks");
        setTasks(mockDataTasks);
        return;
      }

      const { data, error } = await supabase
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
        .order("pinned", { ascending: false })
        .order("due_date", { ascending: true });

      if (error) throw error;

      const typedData: Task[] = data || [];
      setTasks(typedData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    if (!isMockingSupabase) {
      const subscription = supabase
        .channel("public:tasks")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "tasks" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const newTask = payload.new as Task;
              setTasks((current) => [newTask, ...current]);
            } else if (payload.eventType === "UPDATE") {
              const updatedTask = payload.new as Task;
              setTasks((current) =>
                current.map((task) =>
                  task.id === updatedTask.id ? updatedTask : task
                )
              );
            } else if (payload.eventType === "DELETE") {
              setTasks((current) =>
                current.filter((task) => task.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [fetchTasks]);

  const getFilteredTasks = (): Task[] => {
    if (filter === "all") return tasks;
    return tasks.filter((task) => {
      const dueDate = task.due_date ? new Date(task.due_date) : new Date();
      const now = new Date();
      const isNotComplete = task.status !== "complete";
      if (filter === "overdue") return dueDate < now && isNotComplete;
      if (filter === "complete") return task.status === "complete";
      return dueDate >= now && isNotComplete;
    });
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center">
        <div className="w-full">
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as TaskStatus | "all")}
          >
            <SelectTrigger className="filter-dropdown-mobile">
              <SelectValue placeholder="Filter tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue" className="text-destructive">
                Overdue
              </SelectItem>
              <SelectItem value="complete" className="text-success">
                Complete
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ExpandedTaskProvider>
        <TaskHeightProvider>
          <div className="task-list flex flex-col gap-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="task-card animate-pulse">
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <div className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-xl">
                <p className="text-gray-500">No tasks found</p>
              </div>
            )}
          </div>
        </TaskHeightProvider>
      </ExpandedTaskProvider>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button className="fab" aria-label="Create New Task">
            <ClockPlus className="h-6 w-6" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <Suspense fallback={<div>Loading form...</div>}>
            <CreateTaskForm onClose={() => setDialogOpen(false)} />
          </Suspense>
        </DialogContent>
      </Dialog>
    </div>
  );
}