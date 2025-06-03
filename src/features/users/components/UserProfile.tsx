import { memo } from 'react';
import type { User } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, User as UserIcon } from 'lucide-react';

interface UserProfileProps {
  user: User;
  showRole?: boolean;
  compact?: boolean;
}

/**
 * Display component for user profile information
 */
function UserProfile({
  user,
  showRole = false,
  compact = false,
}: UserProfileProps) {
  const displayName = user.name || user.email.split('@')[0];
  const initials = displayName.charAt(0).toUpperCase();

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs" aria-label={`${displayName} (initials)`}>
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {displayName}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        {showRole && user.role && (
          <Badge variant="outline" className="text-xs" aria-label={`Role: ${user.role}`}>
            {user.role}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card role="article" aria-labelledby="user-profile-name">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg" aria-label={`${displayName} (initials)`}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle id="user-profile-name" className="text-lg">{displayName}</CardTitle>
            {showRole && user.role && (
              <Badge variant="outline" className="mt-2" aria-label={`Role: ${user.role}`}>
                {user.role}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" aria-hidden="true" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserIcon className="h-4 w-4" aria-hidden="true" />
          <span>User profile</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(UserProfile);
