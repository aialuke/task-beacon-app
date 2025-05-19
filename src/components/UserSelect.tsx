import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase, isMockingSupabase } from "@/lib/supabase";
import { toast } from "@/lib/toast"; // Updated import

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

  useEffect(() => {
    loadUsers();
  }, []);

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
      // If you needed to access specific properties of the error,
      // for example, error.message, you would add a type check:
      // if (error instanceof Error) {
      //   toast.error(error.message);
      // } else {
      //   toast.error("Failed to load users");
      // }
    } finally {
      setLoading(false);
    }
  };


  // Display name or email if name is not available
  const getUserDisplayName = (user: { id: string; name?: string; email: string }) => {
    return user.name || user.email.split('@')[0];
  };

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || loading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select assignee" />
      </SelectTrigger>
      <SelectContent>
        {loading ? (
          <SelectItem value="loading" disabled>Loading users...</SelectItem>
        ) : users.length > 0 ? (
          users.map((user) => (
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
