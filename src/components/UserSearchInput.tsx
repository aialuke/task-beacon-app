import { useEffect, useState } from "react";
import { Check, User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { getAllUsers } from "@/integrations/supabase/api/users.api";

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
  placeholder = "Assign task",
  className,
  onFocus,
  onBlur
}: UserSearchInputProps) {
  const [users, setUsers] = useState<{ id: string; name?: string; email: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; name?: string; email: string } | null>(null);
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
      toast.error("Failed to load users");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Display name or email if name is not available
  const getUserDisplayName = (user: { id: string; name?: string; email: string }) => {
    return user.name || user.email.split('@')[0];
  };

  // Filter users based on search term and limit to 1 result
  const filteredUsers = searchTerm.length > 0
    ? users.filter(user => {
        const displayName = getUserDisplayName(user).toLowerCase();
        const email = user.email.toLowerCase();
        const term = searchTerm.toLowerCase();
        
        return displayName.includes(term) || email.includes(term);
      }).slice(0, 1) // Limit to 1 result
    : users.slice(0, 1); // Show only 1 user when not searching
    
  const handleSelect = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      onChange(userId);
      setSelectedUser(user);
      setSearchTerm("");
      setIsOpen(false);
    }
  };

  const handleClearSelection = () => {
    onChange("");
    setSelectedUser(null);
    setSearchTerm("");
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
      <div className={cn(
        "flex items-center p-2 bg-background/70 border border-border/60 rounded-xl h-12 transition-all duration-200",
        disabled ? "opacity-50" : "hover:bg-accent/50",
        className
      )}>
        <User className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0 self-center" />
        
        {selectedUser ? (
          <div className="flex items-center justify-between w-full">
            <span className="flex-grow text-sm text-foreground">{getUserDisplayName(selectedUser)}</span>
            <button 
              type="button"
              className="text-muted-foreground hover:text-foreground ml-2"
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
              className="flex-1 text-foreground bg-transparent border-none focus:ring-0 p-0 h-auto text-sm"
              disabled={disabled}
              required={false}
              formNoValidate // Explicitly disable validation
            />
            <Search className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
          </>
        )}
      </div>
      
      {isOpen && !selectedUser && filteredUsers.length > 0 && (
        <div 
          className="absolute z-[9999] w-full mt-1 border border-border shadow-lg rounded-xl overflow-hidden"
          style={{ 
            backgroundColor: "hsl(var(--popover))",
            color: "hsl(var(--popover-foreground))"
          }}
        >
          <div className="overflow-y-auto p-1 max-h-20">
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
                    className="relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span>{getUserDisplayName(user)}</span>
                    {user.id === value && <Check className="h-4 w-4 ml-auto" />}
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