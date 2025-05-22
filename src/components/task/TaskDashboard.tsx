
import { useState } from "react";
import TaskList from "./TaskList";
import { supabase } from "@/lib/supabase";
import { toast } from "@/lib/toast";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TaskContextProvider } from "@/contexts/TaskContext";
import { UIContextProvider } from "@/contexts/UIContext";

export default function TaskDashboard() {
  const [open, setOpen] = useState(false); // For DropdownMenu

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
    } catch (error: unknown) {
      console.error("Sign-out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const getAvatarInitial = (email: string | undefined) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  return (
    <TaskContextProvider>
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
              <h1 className="text-xl font-medium text-gray-900">Flow State</h1>
            </div>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-8 w-8">
                  <AvatarFallback className="text-sm avatar-fallback">
                    {getAvatarInitial(undefined)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="p-2 bg-white">
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-foreground">
                  <LogOut className="mr-2 h-4 w-4 text-primary stroke-primary" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <TaskList />
        </div>
      </UIContextProvider>
    </TaskContextProvider>
  );
}
