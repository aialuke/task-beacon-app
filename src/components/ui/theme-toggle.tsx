
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();

  const handleToggle = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className="h-8 w-8 p-0"
      aria-label={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} theme`}
      title={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {actualTheme === 'dark' ? (
        <Sun 
          className="h-4 w-4 text-foreground" 
          aria-hidden="true"
        />
      ) : (
        <Moon 
          className="h-4 w-4 text-foreground" 
          aria-hidden="true"
        />
      )}
      <span className="sr-only">
        {actualTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      </span>
    </Button>
  );
}
