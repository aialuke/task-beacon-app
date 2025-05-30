
import { memo } from 'react';
import { User } from '@/types/shared.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
function UserProfile({ user, showRole = false, compact = false }: UserProfileProps) {
  const displayName = user.name || user.email.split('@')[0];
  const initials = displayName.charAt(0).toUpperCase();

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar_url || undefined} alt={displayName} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {displayName}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user.email}
          </p>
        </div>
        {showRole && user.role && (
          <Badge variant="outline" className="text-xs">
            {user.role}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar_url || undefined} alt={displayName} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{displayName}</CardTitle>
            {showRole && user.role && (
              <Badge variant="outline" className="mt-2">
                {user.role}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserIcon className="h-4 w-4" />
          <span>Member since {new Date(user.created_at).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(UserProfile);
