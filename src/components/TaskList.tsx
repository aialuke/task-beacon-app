import { useState, useEffect, lazy, Suspense } from "react";
import { Task, TaskStatus } from "@/lib/types";
import TaskCard from "./task/TaskCard";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
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
import { TaskExpandProvider } from "@/contexts/TaskExpandContext";

const CreateTaskForm = lazy(() => import("./CreateTaskForm"));

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete project documentation",
    description: "Write up all project details and specifications",
    due_date: new Date(Date.now() + 86400000).toISOString(),
    photo_url: null,
    url_link: "https://example.com/docs",
    owner_id: "user-1",
    parent_task_id: null,
    parent_task: null,
    pinned: true,
    status: "pending",
    assignee_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Client meeting",
    description: "Discuss project timeline and deliverables",
    due_date: new Date(Date.now() - 86400000).toISOString(),
    photo_url: null,
    url_link: null,
    owner_id: "user-2",
    parent_task_id: null,
    parent_task: null,
    pinned: false,
    status: "overdue",
    assignee_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Review code changes",
    description: null,
    due_date: new Date(Date.now() + 172800000).toISOString(),
    photo_url: null,
    url_link: null,
    owner_id: "user-3",
    parent_task_id: null,
    parent_task: null,
    pinned: false,
    status: "pending",
    assignee_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

interface TaskListProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

export default function TaskList({ dialogOpen, setDialogOpen }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");

  const fetchTasks = async () => {
    setLoading(true);
    try {
      if (isMockingSupabase) {
        setTasks(mockTasks);
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
  };

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
      // Corrected cleanup function
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const getFilteredTasks = (): Task[] => {
    if (filter === "all") return tasks;
    return tasks.filter((task) => {
      const dueDate = new Date(task.due_date);
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


      {/* Floating Action Button (FAB) for creating new tasks */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button
            className="fab"
            title="Create New Task"
            aria-label="Create New Task"
          >
            <Plus className="h-6 w-6" />
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
