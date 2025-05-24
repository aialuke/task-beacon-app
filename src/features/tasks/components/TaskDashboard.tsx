
import { useState } from "react";
import TaskList from "./TaskList";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TaskContextProvider } from "@/features/tasks/context/TaskContext";
import { TaskUIContextProvider } from "@/features/tasks/context/TaskUIContext";
import { UIContextProvider } from "@/contexts/UIContext";

export default function TaskDashboard() {
  const [open, setOpen] = useState(false); // For DropdownMenu
  const { signOut, user } = useAuth();

  const getAvatarInitial = (email: string | undefined) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  return (
    <TaskContextProvider>
      <TaskUIContextProvider>
        <UIContextProvider>
          <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 space-y-6">
            <header className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/hourglass_logo.svg"
                  alt="Task Beacon Logo"
                  width={29}
                  height={29}
                  className="text-primary"
                />
                <h1 className="text-xl font-medium text-foreground">Flow State</h1>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <DropdownMenu open={open} onOpenChange={setOpen}>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer h-8 w-8">
                      <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                        {getAvatarInitial(user?.email)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="p-2 bg-popover border-border"
                    style={{
                      backgroundColor: "hsl(var(--popover))",
                      borderColor: "hsl(var(--border))"
                    }}
                  >
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer text-popover-foreground hover:bg-accent">
                      <LogOut className="mr-2 h-4 w-4 text-foreground" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            <TaskList />
          </div>
        </UIContextProvider>
      </TaskUIContextProvider>
    </TaskContextProvider>
  );
}
