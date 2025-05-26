
import { Calendar, User, FileText, Link } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionBarProps {
  activeToggles: {
    dueDate: boolean;
    assignee: boolean;
    photo: boolean;
    url: boolean;
    description: boolean;
  };
  onToggle: (toggle: keyof QuickActionBarProps['activeToggles']) => void;
  disabled?: boolean;
}

export function QuickActionBar({ activeToggles, onToggle, disabled = false }: QuickActionBarProps) {
  const toggles = [
    {
      key: 'dueDate' as const,
      icon: Calendar,
      label: 'Due Date',
      active: activeToggles.dueDate
    },
    {
      key: 'assignee' as const,
      icon: User,
      label: 'Assign',
      active: activeToggles.assignee
    },
    {
      key: 'photo' as const,
      icon: FileText,
      label: 'Attach',
      active: activeToggles.photo
    },
    {
      key: 'url' as const,
      icon: Link,
      label: 'Link',
      active: activeToggles.url
    },
    {
      key: 'description' as const,
      icon: FileText,
      label: 'Notes',
      active: activeToggles.description
    }
  ];

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-background/30 backdrop-blur-sm rounded-xl border border-border/20">
      {toggles.map(({ key, icon: Icon, label, active }) => (
        <button
          key={key}
          type="button"
          onClick={() => onToggle(key)}
          disabled={disabled}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 min-h-[44px] touch-manipulation",
            "hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
            active
              ? "bg-primary/20 text-primary border border-primary/30 shadow-md shadow-primary/10"
              : "bg-background/60 text-muted-foreground border border-border/40 hover:bg-background/80 hover:text-foreground hover:border-border/60",
            disabled && "opacity-50 cursor-not-allowed hover:scale-100"
          )}
        >
          <Icon className={cn(
            "h-4 w-4 transition-all duration-200",
            active && "scale-110"
          )} />
          <span className="text-sm font-medium hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
