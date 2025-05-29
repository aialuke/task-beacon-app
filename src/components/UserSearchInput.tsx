import { useEffect, useState } from 'react';
import { Check, User, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/toast';
import { getAllUsers } from '@/integrations/supabase/api/users.api';

interface UserSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function UserSearchInput({
  value,
  onChange,
  disabled = false,
  placeholder = 'Assign task',
  className,
  onFocus,
  onBlur,
}: UserSearchInputProps) {
  const [users, setUsers] = useState<
    { id: string; name?: string; email: string }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name?: string;
    email: string;
  } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Set selected user when value changes from parent
  useEffect(() => {
    if (value && users.length > 0) {
      const user = users.find(u => u.id === value);
      if (user) {
        setSelectedUser(user);
      }
    } else if (!value) {
      setSelectedUser(null);
    }
  }, [value, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await getAllUsers();

      if (error) throw error;
      setUsers(data || []);
    } catch (error: unknown) {
      toast.error('Failed to load users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Display name or email if name is not available
  const getUserDisplayName = (user: {
    id: string;
    name?: string;
    email: string;
  }) => {
    return user.name || user.email.split('@')[0];
  };

  // Filter users based on search term and limit to 1 result
  const filteredUsers =
    searchTerm.length > 0
      ? users
          .filter(user => {
            const displayName = getUserDisplayName(user).toLowerCase();
            const email = user.email.toLowerCase();
            const term = searchTerm.toLowerCase();

            return displayName.includes(term) || email.includes(term);
          })
          .slice(0, 1) // Limit to 1 result
      : users.slice(0, 1); // Show only 1 user when not searching

  const handleSelect = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      onChange(userId);
      setSelectedUser(user);
      setSearchTerm('');
      setIsOpen(false);
    }
  };

  const handleClearSelection = () => {
    onChange('');
    setSelectedUser(null);
    setSearchTerm('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    onFocus?.();
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
    onBlur?.();
  };

  return (
    <div className="relative w-full">
      <div
        className={cn(
          'flex h-12 items-center rounded-xl border border-border/60 bg-background/70 p-2 transition-all duration-200',
          disabled ? 'opacity-50' : 'hover:bg-accent/50',
          className
        )}
      >
        <User className="mr-3 h-5 w-5 flex-shrink-0 self-center text-muted-foreground" />

        {selectedUser ? (
          <div className="flex w-full items-center justify-between">
            <span className="flex-grow text-sm text-foreground">
              {getUserDisplayName(selectedUser)}
            </span>
            <button
              type="button"
              className="ml-2 text-muted-foreground hover:text-foreground"
              onClick={handleClearSelection}
              disabled={disabled}
            >
              ×
            </button>
          </div>
        ) : (
          <>
            <Input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className="h-auto flex-1 border-none bg-transparent p-0 text-sm text-foreground focus:ring-0"
              disabled={disabled}
              required={false}
              formNoValidate // Explicitly disable validation
            />
            <Search className="ml-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
          </>
        )}
      </div>

      {isOpen && !selectedUser && filteredUsers.length > 0 && (
        <div
          className="absolute z-[9999] mt-1 w-full overflow-hidden rounded-xl border border-border shadow-lg"
          style={{
            backgroundColor: 'hsl(var(--popover))',
            color: 'hsl(var(--popover-foreground))',
          }}
        >
          <div className="max-h-20 overflow-y-auto p-1">
            {loading ? (
              <div className="py-2 text-center text-sm">Loading...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-2 text-center text-sm">No user found.</div>
            ) : (
              <div>
                {filteredUsers.map(user => (
                  <div
                    key={user.id}
                    onClick={() => handleSelect(user.id)}
                    className="relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>{getUserDisplayName(user)}</span>
                    {user.id === value && <Check className="ml-auto h-4 w-4" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
