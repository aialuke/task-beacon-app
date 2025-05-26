
import TaskList from "./TaskList";
import TaskDashboardHeader from "./TaskDashboardHeader";
import { TaskContextProvider } from "@/features/tasks/context/TaskContext";
import { TaskUIContextProvider } from "@/features/tasks/context/TaskUIContext";

export default function TaskDashboard() {
  return (
    <TaskContextProvider>
      <TaskUIContextProvider>
        <div className="min-h-screen bg-background">
          <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6">
            <TaskDashboardHeader />
            
            {/* Main Content Section */}
            <main className="task-dashboard-main">
              <TaskList />
            </main>
          </div>
        </div>
      </TaskUIContextProvider>
    </TaskContextProvider>
  );
}
