
import { useState, useEffect, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "@/lib/toast";
import { Input } from "@/components/ui/input";

// Mock users for development
const mockUsers = [
  { id: "user-1", name: "Alex Johnson", email: "alex@example.com" },
  { id: "user-2", name: "Taylor Smith", email: "taylor@example.com" },
  { id: "user-3", name: "Jordan Davis", email: "jordan@example.com" },
];

interface UserSelectProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function UserSelect({ value, onChange, disabled = false }: UserSelectProps) {
  const [users, setUsers] = useState<{ id: string; name?: string; email: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

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

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    
    return users.filter(user => {
      const displayName = getUserDisplayName(user).toLowerCase();
      const email = user.email.toLowerCase();
      const term = searchTerm.toLowerCase();
      
      return displayName.includes(term) || email.includes(term);
    });
  }, [users, searchTerm]);

  // Display name or email if name is not available
  const getUserDisplayName = (user: { id: string; name?: string; email: string }) => {
    return user.name || user.email.split('@')[0];
  };

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || loading}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select assignee" />
      </SelectTrigger>
      <SelectContent>
        <div className="px-2 py-2">
          <Input 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
        </div>
        {loading ? (
          <SelectItem value="loading" disabled>Loading users...</SelectItem>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {getUserDisplayName(user)}
            </SelectItem>
          ))
        ) : (
          <SelectItem value="none" disabled>No users found</SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
