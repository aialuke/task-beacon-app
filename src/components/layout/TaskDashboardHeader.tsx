import { LogOut, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/hooks/core/auth';

function TaskDashboardHeader() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <img
            src="/assets/hourglass_logo.svg"
            alt="Task Flow Logo"
            className="size-7 sm:size-8"
          />
          <h1 className="text-xl font-semibold tracking-wide text-foreground sm:text-2xl">
            Task Flow
          </h1>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="relative size-10 rounded-full p-0"
              >
                <Avatar className="size-9">
                  <AvatarImage
                    src={user.user_metadata?.avatar_url}
                    alt={user.user_metadata?.full_name ?? user.email ?? 'User'}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="end">
              <div className="flex flex-col">
                <div className="border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">
                        {user.user_metadata?.full_name ?? 'User'}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive/80 focus-visible:ring-2 focus-visible:ring-destructive/30 active:bg-destructive/20 active:text-destructive/90 dark:hover:bg-destructive/10 dark:active:bg-destructive/20"
                    onClick={handleLogout}
                  >
                    <LogOut className="size-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </header>
  );
}

export default TaskDashboardHeader;
