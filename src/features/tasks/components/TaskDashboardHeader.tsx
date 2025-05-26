
import { useState } from "react";
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

export default function TaskDashboardHeader() {
  const [open, setOpen] = useState(false);
  const { signOut, user } = useAuth();

  const getAvatarInitial = (email: string | undefined) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  return (
    <header className="flex items-center justify-between mb-6">
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
            <Avatar className="cursor-pointer h-8 w-8 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 active:scale-95 focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                {getAvatarInitial(user?.email)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="p-2"
          >
            <DropdownMenuItem onClick={signOut} className="cursor-pointer transition-colors duration-200 hover:bg-accent">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
