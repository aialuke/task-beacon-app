import { useState, useEffect } from "react";
import { Task, TaskStatus } from "@/lib/types";
import TaskCard from "./task/TaskCard";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ClockPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CreateTaskForm from "./CreateTaskForm";
import { TaskExpandProvider } from "@/contexts/TaskExpandContext";

// Mock data for development when Supabase is not connected
const mockTasks: Task[] = [{
  id: "1",
  title: "Complete project documentation",
  description: "Write up all project details and specifications",
  due_date: new Date(Date.now() + 86400000).toISOString(),
  // Tomorrow
  photo_url: null,
  url_link: "https://example.com/docs",
  owner_id: "user-1",
  pinned: true,
  status: "pending",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}, {
  id: "2",
  title: "Client meeting",
  description: "Discuss project timeline and deliverables",
  due_date: new Date(Date.now() - 86400000).toISOString(),
  // Yesterday (overdue)
  photo_url: null,
  url_link: null,
  owner_id: "user-2",
  pinned: false,
  status: "overdue",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}, {
  id: "3",
  title: "Review code changes",
  description: null,
  due_date: new Date(Date.now() + 172800000).toISOString(),
  // Day after tomorrow
  photo_url: null,
  url_link: null,
  owner_id: "user-3",
  pinned: false,
  status: "pending",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
}];
interface TaskListProps {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}
export default function TaskList({
  dialogOpen,
  setDialogOpen
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
    if (!isMockingSupabase) {
      // Set up real-time subscription for task updates
      const subscription = supabase.channel('public:tasks').on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks'
      }, payload => {
        // Handle different types of changes
        if (payload.eventType === 'INSERT') {
          const newTask = payload.new as Task;
          setTasks(current => [newTask, ...current]);
        } else if (payload.eventType === 'UPDATE') {
          const updatedTask = payload.new as Task;
          setTasks(current => current.map(task => task.id === updatedTask.id ? updatedTask : task));
        } else if (payload.eventType === 'DELETE') {
          setTasks(current => current.filter(task => task.id !== payload.old.id));
        }
      }).subscribe();
      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Fetch tasks from Supabase or use mock data
  const fetchTasks = async () => {
    setLoading(true);
    try {
      if (isMockingSupabase) {
        // Use mock data when Supabase is not connected
        setTasks(mockTasks);
        setLoading(false);
        return;
      }

      // Updated query to get parent task details when available
      const {
        data,
        error
      } = await supabase.from("tasks").select(`
          *,
          parent_task:parent_task_id (
            title,
            description,
            photo_url,
            url_link
          )
        `).order("pinned", {
        ascending: false
      }).order("due_date", {
        ascending: true
      });
      if (error) throw error;

      // Ensure data conforms to Task type
      const typedData: Task[] = data ? data.map((item: any) => {
        // Create a proper Task object
        const task: Task = {
          id: item.id,
          title: item.title,
          description: item.description,
          due_date: item.due_date,
          photo_url: item.photo_url,
          url_link: item.url_link,
          owner_id: item.owner_id,
          parent_task_id: item.parent_task_id,
          pinned: item.pinned,
          status: item.status as TaskStatus,
          assignee_id: item.assignee_id,
          created_at: item.created_at,
          updated_at: item.updated_at
        };

        // Safely handle parent_task with type assertion and null checks
        if (item.parent_task && typeof item.parent_task === 'object') {
          const parentTask = item.parent_task as Record<string, any>;
          task.parent_task = {
            title: typeof parentTask.title === 'string' ? parentTask.title : "",
            description: parentTask.description ?? null,
            photo_url: parentTask.photo_url ?? null,
            url_link: parentTask.url_link ?? null
          };
        }
        return task;
      }) : [];
      setTasks(typedData);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort tasks
  const getFilteredTasks = (): Task[] => {
    if (filter === "all") return tasks;
    return tasks.filter(task => {
      const dueDate = new Date(task.due_date);
      const now = new Date();
      if (filter === "overdue") {
        return dueDate < now && task.status !== "complete";
      } else if (filter === "complete") {
        return task.status === "complete";
      } else {
        return dueDate >= now && task.status !== "complete";
      }
    });
  };
  const filteredTasks = getFilteredTasks();
  return <div className="space-y-4">
      {/* Filter and Create buttons */}
      <div className="flex items-center justify-between">
        <div className="w-full max-w-xs">
          <Select value={filter} onValueChange={value => setFilter(value as TaskStatus | "all")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue" className="text-destructive">Overdue</SelectItem>
              <SelectItem value="complete" className="text-success">Complete</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="h-10 w-10 rounded-md bg-primary hover:bg-primary/80 hover:scale-105 transition-all p-0" title="Create New Task">
              <ClockPlus className="h-5 w-5 text-white" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              
            </DialogHeader>
            <CreateTaskForm onClose={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Task list with TaskExpandProvider */}
      <TaskExpandProvider>
        <div className="task-list flex flex-col gap-3">
          {loading ?
        // Skeleton loaders
        Array.from({
          length: 5
        }).map((_, i) => <div key={i} className="task-card animate-pulse">
                <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>) : filteredTasks.length > 0 ? filteredTasks.map(task => <TaskCard key={task.id} task={task} />) : <div className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-xl">
              <p className="text-gray-500">No tasks found</p>
            </div>}
        </div>
      </TaskExpandProvider>
    </div>;
}
