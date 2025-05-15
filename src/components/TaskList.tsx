
import { useState, useEffect } from "react";
import { Task, TaskStatus } from "@/lib/types";
import TaskCard from "./TaskCard";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Mock data for development when Supabase is not connected
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete project documentation",
    description: "Write up all project details and specifications",
    due_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    photo_url: null,
    url_link: "https://example.com/docs",
    owner_id: "user-1",
    pinned: true,
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "Client meeting",
    description: "Discuss project timeline and deliverables",
    due_date: new Date(Date.now() - 86400000).toISOString(), // Yesterday (overdue)
    photo_url: null,
    url_link: null,
    owner_id: "user-1",
    pinned: false,
    status: "overdue",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    title: "Review code changes",
    description: null,
    due_date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    photo_url: null,
    url_link: null,
    owner_id: "user-1",
    pinned: false,
    status: "pending",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskStatus | "all">("all");

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
    
    if (!isMockingSupabase) {
      // Set up real-time subscription for task updates
      const subscription = supabase
        .channel('public:tasks')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, payload => {
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            const newTask = payload.new as Task;
            setTasks(current => [newTask, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedTask = payload.new as Task;
            setTasks(current => 
              current.map(task => task.id === updatedTask.id ? updatedTask : task)
            );
          } else if (payload.eventType === 'DELETE') {
            setTasks(current => current.filter(task => task.id !== payload.old.id));
          }
        })
        .subscribe();
        
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
      
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("pinned", { ascending: false })
        .order("due_date", { ascending: true });

      if (error) throw error;
      
      // Ensure data conforms to Task type
      const typedData: Task[] = data ? data.map(item => ({
        ...item,
        status: item.status as TaskStatus
      })) : [];
      
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

  return (
    <div className="space-y-4">
      {/* Filter buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button 
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button 
          variant={filter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("pending")}
        >
          Pending
        </Button>
        <Button 
          variant={filter === "overdue" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("overdue")}
          className={filter === "overdue" ? "bg-destructive text-white" : "text-destructive"}
        >
          Overdue
        </Button>
        <Button 
          variant={filter === "complete" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("complete")}
          className={filter === "complete" ? "bg-success text-white" : "text-success"}
        >
          Complete
        </Button>
      </div>

      {/* Task list */}
      <div className="grid gap-2">
        {loading ? (
          // Skeleton loaders
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="task-card animate-pulse">
              <div className="h-12 w-12 rounded-full bg-gray-200"></div>
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-md">
            <p className="text-gray-500">No tasks found</p>
          </div>
        )}
      </div>
      
      {isMockingSupabase && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
          <p className="font-medium">⚠️ Using mock data</p>
          <p className="text-xs mt-1">
            Connect to Supabase using the green Supabase button in the top right to enable real data and all features.
          </p>
        </div>
      )}
    </div>
  );
}
