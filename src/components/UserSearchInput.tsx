
import { useEffect, useState } from "react";
import { Check, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "@/lib/toast";

// Mock users for development
const mockUsers = [
  { id: "user-1", name: "Alex Johnson", email: "alex@example.com" },
  { id: "user-2", name: "Taylor Smith", email: "taylor@example.com" },
  { id: "user-3", name: "Jordan Davis", email: "jordan@example.com" },
];

interface UserSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function UserSearchInput({ 
  value, 
  onChange, 
  disabled = false,
  placeholder = "Search user..." 
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
      if (isMockingSupabase) {
        // Use mock data when Supabase is not connected
        setUsers(mockUsers);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("id, name, email")
        .order("name", { ascending: true });

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

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    // Improved blur handling to avoid TypeErrors
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div 
      className="relative w-full"
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className={cn(
        "flex items-center border border-input rounded-md w-full",
        disabled ? "bg-muted opacity-50" : "bg-background",
        isOpen ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""
      )}>
        <div className="flex items-center pl-3">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
        
        {selectedUser ? (
          <div className="flex items-center justify-between w-full px-3 py-2 text-sm">
            <span className="flex-grow">{getUserDisplayName(selectedUser)}</span>
            <button 
              type="button"
              className="text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange("");
                setSelectedUser(null);
                setSearchTerm("");
              }}
              disabled={disabled}
            >
              ×
            </button>
          </div>
        ) : (
          <input 
            type="text"
            placeholder={placeholder} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border-0 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-0"
            disabled={disabled}
          />
        )}
      </div>
      
      {isOpen && !selectedUser && filteredUsers.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground shadow-md rounded-md overflow-hidden border border-border">
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
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
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
