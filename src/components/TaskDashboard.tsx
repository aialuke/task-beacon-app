import React from 'react';
import { useState, useEffect } from "react";
import TaskList from "./TaskList";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TaskDashboard() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{id: string, email: string} | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (isMockingSupabase) {
        setUser({ id: "mock-user", email: "mock@example.com" });
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user ? { id: user.id, email: user.email || "" } : null);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: unknown) {
      console.error("Sign-out error:", error);
    }
  };

  // Get first letter of email for avatar
  const getAvatarInitial = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-6 space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 402.32 648.05"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path
              d="M1422.43.33c6,114.15-47.13,195.18-141.19,254.11,8.24,6.16,15.82,11.78,23.34,17.47,29.79,22.55,56.89,47.77,77.73,79.07,21.28,32,35.22,66.92,39,105.2,1.6,16.44-.13,33.19-.38,49.8,0,2.48-.24,5-.41,8.24,7.18,0,14.12.32,21-.09,5.63-.34,7.23,2,7.16,7.26-.17,11.49-.09,39.8-.05,53a6.91,6.91,0,0,1-6.91,6.94c-17.37,0-355.84.09-388.37.06a7,7,0,0,1-7-7c.05-11.11.19-26.1.18-34.44,0-6.17.16-12.34-.18-18.49s2.49-8.46,8.32-8.28c5.13.16,10.27,0,16.32,0,0-4,0-7.43,0-10.86-.21-27.67.27-55.27,7.82-82.2,13-46.58,39.34-85,74.2-117.61,16.86-15.76,35.55-29.57,53.42-44.26,1.53-1.25,3.12-2.43,5.9-4.6C1117.16,195.87,1067.15,113,1070.41-.24c-6.12,0-11.72-.22-17.3.07-5.22,0-5.56-2-5.56-8.71,0-15.89,0-31.2,0-47.64,0-8.13.5-10.11,6.67-10.11q164.88.18,329.78.07c18.15,0,36.31.14,54.46,0,7-.07,7.07,3.33,7.07,13.2,0,13.73.43,29.15.43,42.4,0,9.91-1.88,11.34-7.73,11.34Z"
              transform="translate(-1046.32 66.63)"
              fill="currentColor"
            />
            <path
              d="M1246.55,569.87c-60.31,0-120.62-.07-180.92.12-6,0-7.88-1.8-7.67-7.71.35-9.48-.11-19-.19-28.48-.08-8.63-.06-8.66,8.43-8.64q73,.15,145.94.32,108.21.13,216.41,0c6.6,0,8.55,1.88,8,8.7a174.12,174.12,0,0,0-.21,27c.55,6.8-1.29,8.81-7.41,8.79-60.81-.17-121.62-.1-182.43-.1Z"
              transform="translate(-1046.32 66.63)"
              fill="currentColor"
            />
            <path
              d="M1434.27-55.29c0,11.13.27,21.41-.07,31.66-.39,11.8-.63,11.79-12.59,11.78q-177.45-.11-354.9-.08c-6.16,0-8.6-1.38-8.28-8a274.84,274.84,0,0,0-.47-28c-.3-5.6,1.46-7.47,7.28-7.46q158,.23,315.93.09l47,0Z"
              transform="translate(-1046.32 66.63)"
              fill="currentColor"
            />
          </svg>
          <h1 className="text-xl font-bold">Task Flow</h1>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-10 w-10 bg-white border border-gray-200 cursor-pointer hover:bg-gray-50">
                <AvatarFallback className="bg-white text-primary font-bold">
                  {getAvatarInitial()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white p-2 shadow-md">
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main>
        <TaskList dialogOpen={open} setDialogOpen={setOpen} />
      </main>
    </div>
  );
}